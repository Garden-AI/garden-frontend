import { http, HttpResponse } from 'msw'

export const handlers = [
    http.get('https://search.api.globus.org/v1/index/58e4df29-4492-4e7d-9317-b27eba62a911/search', () => {
        return HttpResponse.json({
            "total": 1,
            "gmeta": [
                {
                    "@datatype": "GMetaResult",
                    "subject": "10.23677/4ksa-8x13",
                    "@version": "2019-08-27",
                    "entries": [
                        {
                            "content": {
                                "pipeline_aliases": {},
                                "year": "2023",
                                "description": "A collection of seedling gardens that illustrate the different flavors of ML libraries that Garden supports",
                                "language": "en",
                                "title": "Flavor Examples",
                                "tags": ["science"],
                                "pipelines": [
                                    {
                                        "models": [
                                            {
                                                "full_name": "willengler-uc/steel-classifier",
                                                "model_name": "steel-classifier",
                                                "repository": "Hugging Face",
                                                "datasets": [{
                                                    "title": "Training Dataset for Locating Atoms in STEM images", 
                                                    "doi": "10.18126/qsdl-aj6x", 
                                                    "url": "https://foundry-ml.org/#/datasets/10.18126%2Fqsdl-aj6x",
                                                    "data_type": null,
                                                    "repository": "Foundry"
                                                }]
                                            }
                                        ],
                                        "papers": [
                                            {
                                                "title": "End-to-end AI framework for interpretable prediction of molecular and crystal properties", 
                                                "authors": ["Hyun Park", "Ruijie Zhu", "E A Huerta", "Santanu Chaudhuri", "Emad Tajkhorshid", "Donny Cooper"], 
                                                "doi": "10.1088/2632-2153/acd434", 
                                                "citation": "Hyun Park et al 2023 Mach. Learn.: Sci. Technol. 4 025036"
                                            }
                                        ],
                                        "repositories": [
                                            {
                                                "repo_name": "Peptimizer", 
                                                "url": "https://github.com/learningmatter-mit/peptimizer", 
                                                "contributors": ["Somesh Mohapatra"]
                                            }
                                        ],
                                        "year": "2023",
                                        "description": "Pipeline for predicting the tensile strength (in MPa) of different compositions of alloy steels",
                                        "func_uuid": "2a4fff73-6e1d-479f-8ad2-a92fc20070ca",
                                        "title": "Steel Alloy Tensile Strength Prediction",
                                        "notebook": "{\"cells\":[{\"cell_type\":\"markdown\",\"metadata\":{},\"source\":[\"### Running the cell below will load every definition in your original notebook within a containerized environment.\"]},{\"cell_type\":\"code\",\"execution_count\":null,\"metadata\":{},\"outputs\":[],\"source\":[\"import dill\\n\",\"\\n\",\"_globals_pre_load = dict(globals())\\n\",\"\\n\",\"dill.load_session(\\\"session.pkl\\\")\\n\",\"print([k for k in globals() if k not in _globals_pre_load])  # displays everything that was loaded\\n\",\"\\n\",\"del dill\\n\",\"del _globals_pre_load\"]},{\"cell_type\":\"markdown\",\"metadata\":{},\"source\":[\"### Now that your definitions have been loaded, feel free to test anything you like with confidence that this environment is nearly identical to the one that is executed remotely.\"]},{\"cell_type\":\"code\",\"execution_count\":null,\"metadata\":{},\"outputs\":[],\"source\":[]}],\"metadata\":{\"kernelspec\":{\"display_name\":\"Python 3 (ipykernel)\",\"language\":\"python\",\"name\":\"python3\"},\"language_info\":{\"codemirror_mode\":{\"name\":\"ipython\",\"version\":3},\"file_extension\":\".py\",\"mimetype\":\"text/x-python\",\"name\":\"python\",\"nbconvert_exporter\":\"python\",\"pygments_lexer\":\"ipython3\",\"version\":\"3.10.12\"}},\"nbformat\":4,\"nbformat_minor\":4}",
                                        "tags": [],
                                        "short_name": "sklearn_tensile_strength_predict",
                                        "doi": "10.23677/etya-kq52",
                                        "authors": [
                                            "Will Engler"
                                        ]
                                    },
                                ],
                                "publisher": "Garden-AI",
                                "contributors": [],
                                "pipeline_ids": [
                                    "10.23677/etya-kq52",
                                ],
                                "authors": [
                                    "Will Engler"
                                ],
                                "doi": "10.23677/4ksa-8x13"
                            },
                            "entry_id": null,
                            "matched_principal_sets": []
                        }
                    ]
                }
            ],
            "@datatype": "GSearchResult",
            "@version": "2017-09-01",
            "offset": 0,
            "count": 1,
            "has_next_page": false
        })
  }),
]