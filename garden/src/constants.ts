const GLOBUS_NATIVE_CLIENT_ID = "1fbb4126-1e48-4f30-8c0f-d71c2715c244"
const SEARCH_SCOPE = "urn:globus:auth:scope:search.api.globus.org:all"
const GARDEN_SCOPE = "https://auth.globus.org/scopes/0948a6b0-a622-4078-b0a4-bfd6d77d65cf/action_all"
const GARDEN_ENDPOINT = "https://nu3cetwc84.execute-api.us-east-1.amazonaws.com/garden_prod"
const SEARCH_ENDPOINT = "https://search.api.globus.org/"
const GARDEN_INDEX_UUID = "58e4df29-4492-4e7d-9317-b27eba62a911"
const GARDEN_INDEX_URL = `${SEARCH_ENDPOINT}/v1/index/${GARDEN_INDEX_UUID}`;
    

export {GLOBUS_NATIVE_CLIENT_ID, SEARCH_SCOPE, GARDEN_SCOPE, GARDEN_ENDPOINT, SEARCH_ENDPOINT, GARDEN_INDEX_URL};