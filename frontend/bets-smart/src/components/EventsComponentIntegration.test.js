// src/EventsComponentIntegration.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EventsComponent from "./EventsComponent";
import axios from "axios";

// Mock axios
jest.mock("axios");

describe("EventsComponent Integration Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits form and renders FetchDataComponent", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        response: [
          { name: "USA", flag: "https://example.com/usa-flag.png" }
        ]
      }
    }).mockResolvedValueOnce({
      data: {
        response: [
          { league: { id: 1, name: "Premier League" } }
        ]
      }
    });

    render(<EventsComponent />);

    // Select Sport
    fireEvent.change(screen.getByLabelText(/Sport/i), { target: { value: "football" } });
    
    // Wait for countries to load and select a country
    await screen.findByText(/USA/i);
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "USA" } });

    // Wait for leagues to load and select a league
    await screen.findByText(/Premier League/i);
    fireEvent.change(screen.getByLabelText(/League/i), { target: { value: 1 } });

    // Submit form
    fireEvent.click(screen.getByText(/Show Next 10 Events/i));

    // Check if FetchDataComponent is rendered
    await screen.findByText(/Fetching Data.../i);
  });
});
