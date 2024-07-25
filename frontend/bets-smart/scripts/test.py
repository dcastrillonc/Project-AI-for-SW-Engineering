import os
import json
from dotenv import load_dotenv, find_dotenv
from autogen import ConversableAgent, initiate_chats

# Load environment variables
load_dotenv(find_dotenv())
gemini_api_key = os.getenv("GOOGLE_API_KEY")
llm_config = {"model": "gemini-1.5-flash-latest", "api_key": gemini_api_key, "api_type": "google"}

def initiate_chats_with_json_parsing(chat_queue: list[dict[str, any]]) -> list:
    """
    Initiate chats with enhanced carryover processing to handle JSON.
    """
    finished_chats = []
    for chat_info in chat_queue:
        _chat_carryover = chat_info.get("carryover", [])
        if isinstance(_chat_carryover, str):
            _chat_carryover = [_chat_carryover]

        # Stringify everything in carryover
        processed_carryover = [str(item) for item in _chat_carryover]
        processed_carryover += [str(r.summary) for r in finished_chats]
        chat_info["carryover"] = processed_carryover

        # Initiate the chat
        chat_res = chat_info["sender"].initiate_chat(**chat_info)
        finished_chats.append(chat_res)
    return finished_chats

# Define the original insights agent
insights_agent = ConversableAgent(
    name="Insights Agent",
    system_message="You are an insights agent. You analyze historical betting data and provide recommendations to improve betting performance. The user mainly bets on football matches, places bets only on the outcome of the match, bets amount under 25 dollars, and takes odds above 2.15, mainly bets to make the game more interesting. after reciving feedback from the critic, create a final recommendation then return TERMINATE. ",
    llm_config=llm_config,
    code_execution_config=False,
    human_input_mode="NEVER",
)

# Define the customer proxy agent
customer_proxy_agent = ConversableAgent(
    name="customer_proxy_agent",
    system_message="You are a critic agent. You critizice the message and provide feedback.",
    llm_config=llm_config,
    human_input_mode="NEVER",  # No human input required
)

# Function to load historical betting data from a JSON file
def load_historical_bets(filename: str):
    with open(filename, 'r') as file:
        data = json.load(file)
        return data.get("bets", [])

# Load historical betting performance data from mockbets.json
historical_bets_data = load_historical_bets('mockbets.json')

# Function to analyze historical data and provide recommendations
def analyze_historical_bets(data):
    win_count = sum(1 for bet in data if bet["outcome"] == "Win")
    loss_count = len(data) - win_count
    avg_odds = sum(bet["odds"] for bet in data) / len(data)
    
    recommendations = [
        f"You have a total of {win_count} wins and {loss_count} losses.",
        f"Your average betting odds are {avg_odds:.2f}. Consider looking for bets with better odds.",
        "Analyze past wins to identify patterns or strategies that worked well.",
        "Consider diversifying your bets to manage risk more effectively.",
    ]
    
    return recommendations

# Generate insights message
def generate_insights_message(data):
    recommendations = analyze_historical_bets(data)
    return f'''Based on your historical betting data, here are some recommendations to improve your betting performance:\n\n{chr(10).join(recommendations)}'''

# Define the chats
chats = [
    {
        "sender": insights_agent,
        "recipient": customer_proxy_agent,
        "message": generate_insights_message(historical_bets_data),
        "additional_data": historical_bets_data,
        "summary_method": "last_msg",
        "max_turns": 3,
        "clear_history": True
    },
]

# Initiate the chats
chat_results = initiate_chats_with_json_parsing(chats)

# Print the summaries and costs
for chat_result in chat_results:
    print(chat_result.summary)
    print("\n")

for chat_result in chat_results:
    print(chat_result.cost)
    print("\n")
