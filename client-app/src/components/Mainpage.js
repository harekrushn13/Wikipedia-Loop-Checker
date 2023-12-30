import React, { useState } from 'react'
import classes from './Mainpage.module.css'

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
            <div className={classes['container']}>
                <div className={classes['main']}>
                    <h1 className={classes['heading']}>Wikipedia Loop Checker</h1>
                    <div className={classes['inputdiv']}>
                        <label>
                            Wikipedia URL:
                        </label>
                        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder='Enter Wikipedia URL' />
                    </div>
                    <button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Checking Loop...' : 'Check Loop'}
                    </button>
                </div>

                {valid && (
                    <div className={classes.resultsContainer}>
                        <p className={classes.requesttext}>Number of requests: {result.steps}</p>
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
