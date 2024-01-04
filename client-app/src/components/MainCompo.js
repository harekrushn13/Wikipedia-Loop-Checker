import React, { useState } from 'react'
import { useFormik } from 'formik';
import classes from './MainCompo.module.css'

const MainCompo = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            url: '',
        },
        onSubmit: async (values) => {
            setLoading(true);
            setResult(null);

            const response = await fetch(`http://localhost:5000/checkloop`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: values.url,
                })
            });

            const data = await response.json();

            setResult(data);
            setLoading(false);
        }
    })


    const handleClear = () => {
        formik.resetForm();
        setResult(null);
    };

    return (
        <>
            <div className={classes.container}>
                <div className={classes.main}>
                    <h1 className={classes.heading}>
                        Wikipedia Loop Checker
                    </h1>

                    <form onSubmit={formik.handleSubmit}>
                        <div className={classes.inputdiv}>
                            <label htmlFor="url">Wikipedia URL:</label>
                            <input
                                type="text"
                                name="url"
                                placeholder="Enter Wikipedia URL"
                                disabled={loading}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.url}
                            />
                        </div>
                        <button type="submit" disabled={loading} className={classes.checkButton}>
                            {loading ? 'Checking ...' : 'Submit'}
                        </button>
                        <button type="button" onClick={handleClear} className={classes.clearButton}>
                            Clear
                        </button>
                    </form>
                </div>

                {loading && (
                    <div>
                        <h1>Loading ...</h1>
                    </div>
                )}

                {result && (
                    <div className={classes.resultsContainer}>
                        {result.success === 1 ? (

                            <div className={classes.requestContainer}>
                                <p className={classes.requesttext}>
                                    Total Requests :
                                    <span className={classes.requestNumber}>
                                        {result.count}
                                    </span>
                                </p>
                            </div>
                        ) : (

                            <div className={classes.errorContainer}>
                                <div className={classes.errorHeading}>Error : </div>
                                <p className={classes.errorMessage}>{result?.message}</p>
                            </div>
                        )}

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

export default MainCompo