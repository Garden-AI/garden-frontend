const GLOBUS_NATIVE_CLIENT_ID = "1fbb4126-1e48-4f30-8c0f-d71c2715c244"
const SEARCH_SCOPE = "urn:globus:auth:scope:search.api.globus.org:search"
const SEARCH_ENDPOINT = "https://search.api.globus.org/"
const GARDEN_INDEX_UUID = process.env.REACT_APP_SEARCH_INDEX_UUID
const GARDEN_INDEX_URL = `${SEARCH_ENDPOINT}/v1/index/${GARDEN_INDEX_UUID}`;
    

export {GLOBUS_NATIVE_CLIENT_ID, SEARCH_SCOPE, SEARCH_ENDPOINT, GARDEN_INDEX_URL};