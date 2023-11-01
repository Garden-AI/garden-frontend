import { http, HttpResponse } from 'msw'

export const handlers = [
    http.get('https://search.api.globus.org//v1/index/58e4df29-4492-4e7d-9317-b27eba62a911/search', () => {
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
                                "version": "0.0.1",
                                "tags": [],
                                "pipelines": [
                                    {
                                        "models": [
                                            {
                                                "flavor": "sklearn",
                                                "user_email": "willengler@uchicago.edu",
                                                "full_name": "willengler@uchicago.edu/steel_test_2",
                                                "model_name": "steel_test_2",
                                                "mlflow_name": "willengler@uchicago.edu-steel_test_2",
                                                "connections": []
                                            }
                                        ],
                                        "year": "2023",
                                        "description": "Pipeline for predicting the tensile strength (in MPa) of different compositions of alloy steels",
                                        "func_uuid": "2a4fff73-6e1d-479f-8ad2-a92fc20070ca",
                                        "model_full_names": [
                                            "willengler@uchicago.edu/steel_test_2"
                                        ],
                                        "title": "Steel Alloy Tensile Strength Prediction",
                                        "steps": [
                                            {
                                                "input_info": "{'composition_string': <class 'str'>}",
                                                "func": "preprocessing_step: (composition_string: str) -> object",
                                                "description": "\n        Example input: Fe0.620C0.000953Mn0.000521Si0.00102Cr0.000110Ni0.192Mo0.0176V0.000112Nb0.0000616Co0.146Al0.00318Ti0.0185\n        ",
                                                "model_full_names": [],
                                                "contributors": [],
                                                "output_info": "return: <class 'object'>",
                                                "source": "    @step\n    def preprocessing_step(composition_string: str) -> object:\n        \"\"\"\n        Example input: Fe0.620C0.000953Mn0.000521Si0.00102Cr0.000110Ni0.192Mo0.0176V0.000112Nb0.0000616Co0.146Al0.00318Ti0.0185\n        \"\"\"\n        import re\n        import pandas as pd\n\n        atomic_weights = {\n            'Fe': 55.845, 'C': 12.011, 'Mn': 54.938045, 'Si': 28.0855, 'Cr': 51.9961, \n            'Ni': 58.6934, 'Mo': 95.96, 'V': 50.9415, 'Nb': 92.90638, 'Co': 58.933195, \n            'W': 183.84, 'Al': 26.9815386, 'Ti': 47.867, \"N\": 28.014\n        }\n        elements_to_show = ['c', 'mn', 'si', 'cr', 'ni', 'mo', 'v', 'n', 'nb', 'co', 'w', 'al', 'ti']\n\n        # Parse the composition string\n        composition = re.findall(r'([A-Z][a-z]?)(\\d+\\.\\d+)', composition_string)\n        elements, fractions = zip(*composition)\n        fractions = [float(f) for f in fractions]\n    \n        # Calculate the weights\n        weights = [f * atomic_weights[e] for e, f in zip(elements, fractions)]\n        total_weight = sum(weights)\n    \n        # Calculate weight percentages\n        weight_percentages = [w / total_weight * 100 for w in weights]\n    \n        lowercase_elements = [e.lower() for e in elements]\n        missing_elements = []\n        for e in elements_to_show:\n          if e not in lowercase_elements:\n            missing_elements.append(e)\n        lowercase_elements += missing_elements\n        weight_percentages += [0.0] * len(missing_elements)\n    \n    \n        # Create DataFrame\n        df = pd.DataFrame([weight_percentages], columns=lowercase_elements)\n        df = df.drop([\"fe\"], axis=1)\n        df = df[elements_to_show]\n        return df\n",
                                                "title": "preprocessing_step",
                                                "authors": []
                                            },
                                            {
                                                "input_info": "{'df': <class 'object'>}",
                                                "func": "run_inference: (df: object, model=<__main__._Model object at 0x128787040>) -> object",
                                                "description": null,
                                                "model_full_names": [
                                                    "willengler@uchicago.edu/steel_test_2"
                                                ],
                                                "contributors": [],
                                                "output_info": "return: <class 'object'>",
                                                "source": "    @step\n    def run_inference(\n        df: object,\n        model=Model('willengler@uchicago.edu/steel_test_2'),\n    ) -> object:\n        return model.predict(df)\n",
                                                "title": "run_inference",
                                                "authors": []
                                            }
                                        ],
                                        "version": "0.0.1",
                                        "conda_dependencies": [],
                                        "tags": [],
                                        "pip_dependencies": [
                                            "mlflow-skinny==2.4.1",
                                            "scikit-learn==1.2.2",
                                            "pandas<3"
                                        ],
                                        "python_version": "3.9.6",
                                        "short_name": "sklearn_tensile_strength_predict",
                                        "contributors": [],
                                        "doi": "10.23677/etya-kq52",
                                        "authors": [
                                            "Will Engler"
                                        ]
                                    },
                                    {
                                        "models": [
                                            {
                                                "flavor": "tensorflow",
                                                "user_email": "willengler@uchicago.edu",
                                                "full_name": "willengler@uchicago.edu/keras-mnist-digit-predict",
                                                "model_name": "keras-mnist-digit-predict",
                                                "mlflow_name": "willengler@uchicago.edu-keras-mnist-digit-predict",
                                                "connections": []
                                            }
                                        ],
                                        "year": "2023",
                                        "description": "",
                                        "func_uuid": "0863e7f6-32fc-4659-a69c-f74d8bf2f744",
                                        "model_full_names": [
                                            "willengler@uchicago.edu/keras-mnist-digit-predict"
                                        ],
                                        "title": "MNIST Digit Prediction in Garden",
                                        "steps": [
                                            {
                                                "input_info": "{'input_tensor': <class 'object'>}",
                                                "func": "run_inference: (input_tensor: object, model=<__main__._Model object at 0x1238a9fd0>) -> object",
                                                "description": null,
                                                "model_full_names": [
                                                    "willengler@uchicago.edu/keras-mnist-digit-predict"
                                                ],
                                                "contributors": [],
                                                "output_info": "return: <class 'object'>",
                                                "source": "    @step\n    def run_inference(\n        input_tensor: object,\n        model=Model(\"willengler@uchicago.edu/keras-mnist-digit-predict\"),\n    ) -> object:\n        import tensorflow as tf\n        predictions = model.predict(input_tensor)\n        return tf.math.argmax(predictions, 1)\n",
                                                "title": "run_inference",
                                                "authors": []
                                            }
                                        ],
                                        "version": "0.0.1",
                                        "conda_dependencies": [],
                                        "tags": [],
                                        "pip_dependencies": [
                                            "mlflow-skinny==2.4.1",
                                            "pandas<3",
                                            "tensorflow==2.13.0"
                                        ],
                                        "python_version": "3.9.6",
                                        "short_name": "keras_mnist_digit_predict",
                                        "contributors": [],
                                        "doi": "10.23677/twn4-sw80",
                                        "authors": [
                                            "Will Engler"
                                        ]
                                    },
                                    {
                                        "models": [
                                            {
                                                "flavor": "pytorch",
                                                "user_email": "willengler@uchicago.edu",
                                                "full_name": "willengler@uchicago.edu/torch-test",
                                                "model_name": "torch-test",
                                                "mlflow_name": "willengler@uchicago.edu-torch-test",
                                                "connections": []
                                            }
                                        ],
                                        "year": "2023",
                                        "description": "",
                                        "func_uuid": "eaad0fee-258e-4ae2-8987-27c69e794406",
                                        "model_full_names": [
                                            "willengler@uchicago.edu/torch-test"
                                        ],
                                        "title": "Predict f(x) = 2x - 1",
                                        "steps": [
                                            {
                                                "input_info": "{'input_tensor': <class 'object'>}",
                                                "func": "run_inference: (input_tensor: object, model=<__main__._Model object at 0x135ce7e20>) -> object",
                                                "description": null,
                                                "model_full_names": [
                                                    "willengler@uchicago.edu/torch-test"
                                                ],
                                                "contributors": [],
                                                "output_info": "return: <class 'object'>",
                                                "source": "    @step\n    def run_inference(\n        input_tensor: object,\n        model=Model(\"willengler@uchicago.edu/torch-test\"),\n    ) -> object:\n        return model.predict(input_tensor)\n",
                                                "title": "run_inference",
                                                "authors": []
                                            }
                                        ],
                                        "version": "0.0.1",
                                        "conda_dependencies": [],
                                        "tags": [],
                                        "pip_dependencies": [
                                            "mlflow-skinny==2.4.1",
                                            "pandas<3",
                                            "torch==2.0.1"
                                        ],
                                        "python_version": "3.9.6",
                                        "short_name": "torch_linear_function_predict",
                                        "contributors": [],
                                        "doi": "10.23677/4rfg-wn07",
                                        "authors": [
                                            "Will Engler"
                                        ]
                                    }
                                ],
                                "publisher": "Garden-AI",
                                "contributors": [],
                                "pipeline_ids": [
                                    "10.23677/etya-kq52",
                                    "10.23677/twn4-sw80",
                                    "10.23677/4rfg-wn07"
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