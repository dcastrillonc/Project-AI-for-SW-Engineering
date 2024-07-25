import React, { useEffect, useState } from 'react';

function LiveScores() {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/livescores');
                if (!res.ok) {
                    throw new Error('Failed to fetch scores. Status: ' + res.status);
                }
                const data = await res.json();
                setScores(data.response);
            } catch (error) {
                setError('Failed to load live scores: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScores();
        const interval = setInterval(fetchScores, 30000); // Update scores every 30 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Live Scores</h2>
            {scores.length > 0 ? (
                <ul>
                    {scores.map((score) => (
                        <li key={score.id}>
                            {score.event}: {score.homeTeam} {score.homeScore} - {score.awayScore} {score.awayTeam}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No live scores available right now.</p>
            )}
        </div>
    );
}

export default LiveScores;
