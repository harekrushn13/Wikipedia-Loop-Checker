import React, { useState } from 'react'
import classes from './Mainpage.module.css'

const Mainpage = () => {
    // State variables to manage input, result, and loading state.
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to handle form submission and communicate with the server.
    const handleSubmit = async () => {
        // Set loading state to true and reset result.
        setLoading(true);
        setResult(null);

        // Make a POST request to the server with the provided Wikipedia URL.
        const response = await fetch(`http://localhost:5000/wikipedialoopchecker`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: url,
            })
        });
        // Parse the response as JSON.
        const data = await response.json();

        // Set the result and reset loading state.
        setResult(data);
        setLoading(false);
    }

    // Function to handle clearing the input and result.
    const handleClear = () => {
        setUrl('');
        setResult(null);
    };

    return (
        <>
            <div className={classes.container}>
                <div className={classes.main}>
                    <h1 className={classes.heading}>
                        Wikipedia Loop Checker
                    </h1>
                    <div className={classes.inputdiv}>
                        <label>
                            Wikipedia URL:
                        </label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder='Enter Wikipedia URL'
                        />
                    </div>
                    <button onClick={handleSubmit} disabled={loading} className={classes.checkButton}>
                        {loading ? 'Checking Loop...' : 'Check Loop'}
                    </button>
                    <button onClick={handleClear} className={classes.clearButton}>
                        Clear
                    </button>
                </div>

                {/* Display results if available */}
                {result && (
                    <div className={classes.resultsContainer}>
                        {result.success === 1 ? (
                            // Display total requests if the loop check is successful
                            <div className={classes.requestContainer}>
                                <p className={classes.requesttext}>
                                    Total Requests :
                                    <span className={classes.requestNumber}>
                                        {result.count}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            // Display error message if the loop check fails
                            <div className={classes.errorContainer}>
                                <div className={classes.errorHeading}>Error : </div>
                                <p className={classes.errorMessage}>{result?.message}</p>
                            </div>
                        )}

                        {/* Display visited pages if available */}
                        {result.visitedPages && result.visitedPages.length > 0 && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sr No.</th>
                                        <th>Page</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.visitedPages.map((link, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{link}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}

export default Mainpage
