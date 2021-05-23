import { Map } from './UI/Map';
import { Modal } from './UI/Modal';
import { getAddressFromCoords, getCoordsFromAddress } from './Utility/Location';

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form');
        const locationUserBtn = document.getElementById('locate-btn');
        this.shareBtn = document.getElementById('share-btn');

        this.shareBtn.addEventListener('click', this.sharePlaceHandler);
        locationUserBtn.addEventListener(
            'click',
            this.locationUserHandler.bind(this)
        );
        addressForm.addEventListener(
            'submit',
            this.findAddressHandler.bind(this)
        );
    }

    sharePlaceHandler() {
        const shareLinkInputElement = document.getElementById('share-link');
        if (!navigator.clipboard) {
            shareLinkInputElement.select();
            return;
        }

        navigator.clipboard
            .writeText(shareLinkInputElement.value)
            .then((data) => {
                alert('Copied link into clipboard!');
            })
            .catch((error) => {
                console.log(error);
                shareLinkInputElement.select();
            });
    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates);
        } else {
            this.map = new Map(coordinates);
        }

        this.shareBtn.disabled = false;
        const sharedLinkInputElement = document.getElementById('share-link');
        sharedLinkInputElement.value = `${
            location.origin
        }/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
            coordinates.lng
        }`;
    }

    locationUserHandler() {
        if (!navigator.geolocation) {
            alert(
                'Location feature is not available in your browser. Please use a more modern browser or manually enter the address.'
            );
            return;
        }

        const modal = new Modal('loading-modal-content', 'Loading...');
        modal.show();

        navigator.geolocation.getCurrentPosition(
            async (successResult) => {
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude,
                };
                const address = await getAddressFromCoords(coordinates);
                this.selectPlace(coordinates, address);
                modal.hide();
            },
            (error) => {
                modal.hide();
                alert(
                    'Could not locate you unfortunately. Please enter an address manually!'
                );
            }
        );
    }

    async findAddressHandler(event) {
        event.preventDefault();
        const address = event.target.querySelector('input').value;

        if (!address || address.trim().length === 0) {
            alert('Invalid address entered! Please try again.');
            return;
        }

        const modal = new Modal('loading-modal-content', 'Loading...');
        modal.show();

        try {
            const coordinates = await getCoordsFromAddress(address);
            this.selectPlace(coordinates, address);
        } catch (error) {
            alert(error.message);
        }

        modal.hide();
    }
}

new PlaceFinder();
