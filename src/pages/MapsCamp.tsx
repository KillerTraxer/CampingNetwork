import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: -34.397,
    lng: 150.644
};

const locations = [
    {
        name: 'Ubicación 1',
        lat: -34.397,
        lng: 150.644,
    },
    {
        name: 'Ubicación 2',
        lat: -34.407,
        lng: 150.654,
    },

];

export default function MapsCamp() {
    return (
        <>
            <p className='text-2xl text-black font-bold mb-5'>Ubicaciones de campings</p>
            <LoadScript googleMapsApiKey="AIzaSyC1uiHQ5H6ojVWviR1xlDe_dKNUgjplEo8">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                >
                    {locations.map((location, index) => (
                        <Marker
                            key={index}
                            position={{ lat: location.lat, lng: location.lng }}
                            title={location.name}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </>
    );
}
