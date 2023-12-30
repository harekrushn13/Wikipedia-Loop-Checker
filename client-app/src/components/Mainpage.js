import React, { useState } from 'react'

const Mainpage = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [valid, setValid] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        const response = await fetch(`http://localhost:5000/wikipedialoopchecker`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: url,
            })
        });

        const data = await response.json();
        console.log(data);

        if (data.success === 1) {
            setValid(true);
        } else {
            setValid(false);
        }
        setResult(data);

        setUrl("");
        setLoading(false);
    }

    return (
        <>
            <div>
                <h1>Wikipedia Loop Checker</h1>
                <label>
                    Wikipedia URL:
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder='Enter Wikipedia URL' />
                </label>
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Checking Loop...' : 'Check Loop'}
                </button>

                {valid && (
                    <div>
                        <h2>Results</h2>
                        <p>Number of requests: {result.steps}</p>
                        <ol>
                            {result.visitedPages.map((link, index) => (
                                <li key={index}>{link}</li>
                            ))}
                        </ol>
                    </div>
                )}
                {valid === false && (
                    <div>
                        <h2>Error</h2>
                        <p>{result?.message}</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Mainpage
