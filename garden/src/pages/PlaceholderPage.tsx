import '../placeholder.css';
// import 'purecss';

function PlaceHolderPage() {
    return (
        <div id="layout" className="pure-g">
            <div className="sidebar pure-u-1 pure-u-md-1-4">
                <div className="header">
                    <h1 className="brand-title">Garden AI</h1>
                    <h2 className="brand-tagline">A FAIR Framework for Publishing and Applying AI Models</h2>

                    <nav className="nav">
                        <ul className="nav-list">
                            <li className="nav-item">
                            <a className="pure-button" href="https://github.com/Garden-AI/">Github</a>
                            <a className="pure-button" href="https://pypi.org/project/garden-ai/">PyPI</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="content pure-u-1 pure-u-md-3-4">
                <div>

                    <div className="posts">
                        <h1 className="content-subhead">Project Updates</h1>

                        <section className="post">

                            <div className="post-description">
                                <p>
                                    The AI Model Garden project is under active development. Learn more from our <a href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=2209892&HistoricalAwards=false">NSF Award Abstract</a> and <a href="https://cs.uchicago.edu/news/uchicago-argonne-researchers-will-cultivate-ai-model-gardens-with-3-5m-nsf-grant/">this news article</a> from the University of Chicago Department of Computer Science.
                                </p>
                                <br/>
                                <p>
                                    This website will soon be the web portal for discovering and reusing Model Gardens. For now you can check on our progress in <a href="https://github.com/Garden-AI/">our GitHub repositories</a> and download the Garden CLI from <a href="https://pypi.org/project/garden-ai/">PyPI</a>.</p>
                                <br/>
                                <p>
                                    The Garden team is grateful for the support of the NSF's Office of Advanced Cyberinfrastructure.
                                </p>

                            </div>
                        </section>
                    </div>


                        <div>

                            <div className="posts">
                                <h1 className="content-subhead">Mockups</h1>
                                <div className="post-images pure-g">
                                    <div className="pure-u-1 pure-u-md-1-2">
                                            <img alt="Mockup of an informative model card displaying metadata for an AI model"
                                                className="pure-img-responsive"
                                                src="img/model-card.jpeg"
                                                />
                                    </div>
                                </div>
                            </div>
                        </div>


                    <div className="footer">
                        <div className="pure-menu pure-menu-horizontal">
                            <ul>
                                <li className="pure-menu-item"><a href="https://www.uchicago.edu/" className="pure-menu-link">© 2023 Copyright: University of Chicago</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceHolderPage;