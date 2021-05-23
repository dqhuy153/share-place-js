import { Map } from './UI/Map';

class LoadedPlace {
    constructor(coordinates, address) {
        document.querySelector('header h1').textContent = address;
        new Map(coordinates);
    }
}

const url = new URL(location.href);
const queryParams = url.searchParams;

const coordinates = {
    lat: parseFloat(queryParams.get('lat')),
    lng: +queryParams.get('lng'),
};

const address = queryParams.get('address');

new LoadedPlace(coordinates, address);
