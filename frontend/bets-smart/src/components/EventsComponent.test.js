
// src/EventsComponent.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import EventsComponent from "./EventsComponent";

// Mock axios
jest.mock("axios");

describe("EventsComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders without crashing", () => {
    render(<EventsComponent />);
    expect(screen.getByText(/Select Sport, Country, and League/i)).toBeInTheDocument();
  });

  test("loads and displays countries when sport is selected", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        response: [
          { name: "USA", flag: "https://example.com/usa-flag.png" },
          { name: "UK", flag: "https://example.com/uk-flag.png" }
        ]
      }
    });

    render(<EventsComponent />);
    fireEvent.change(screen.getByLabelText(/Sport/i), { target: { value: "football" } });

    // Wait for the async call to finish and the countries to load
    await screen.findByText(/USA/i);
    await screen.findByText(/UK/i);
  });

  test("displays error message if fetching countries fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(<EventsComponent />);
    fireEvent.change(screen.getByLabelText(/Sport/i), { target: { value: "football" } });

    await screen.findByText(/Error fetching countries/i);
  });

  test("loads and displays leagues when country is selected", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        response: [
          { league: { id: 1, name: "Premier League" } },
          { league: { id: 2, name: "La Liga" } }
        ]
      }
    });

    render(<EventsComponent />);
    fireEvent.change(screen.getByLabelText(/Sport/i), { target: { value: "football" } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "USA" } });

    await screen.findByText(/Premier League/i);
    await screen.findByText(/La Liga/i);
  });

  test("displays error message if fetching leagues fails", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(<EventsComponent />);
    fireEvent.change(screen.getByLabelText(/Sport/i), { target: { value: "football" } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "USA" } });

    await screen.findByText(/Error fetching leagues/i);
  });

  test("enables submit button when sport, country, and league are selected", () => {
    render(<EventsComponent />);
    fireEvent.change(screen.getByLabelText(/Sport/i), { target: { value: "football" } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: "USA" } });
    fireEvent.change(screen.getByLabelText(/League/i), { target: { value: 1 } });

    expect(screen.getByText(/Show Next 10 Events/i)).not.toBeDisabled();
  });
});