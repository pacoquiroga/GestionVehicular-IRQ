/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Error from './Error';
import Confirmacion from './Confirmacion';
import helpHttp from './helpHttp';

const AsignarViaje = ({ choferes, vehiculos, direcciones }) => {
    const [idViaje, setIdViaje] = useState('');
    const [viajes, setViajes] = useState([]);
    const [cedula, setCedula] = useState('');
    const [placa, setPlaca] = useState('');
    const [inicio, setInicio] = useState('');
    const [fin, setFin] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmacion, setConfirmacion] = useState(false);


    let api = helpHttp();
    let url = 'http://localhost:3001'
    let wppAPI = 'http://localhost:8080/send'

    useEffect(() => {
        const generarIdAleatorio = () => {
            return Math.floor(1000 + Math.random() * 9000).toString();
        };

        setIdViaje(generarIdAleatorio());
    }, []);


    const handleChoferChange = (e) => {
        setCedula(e.target.value);
    }

    const handleVehiculoChange = (e) => {
        setPlaca(e.target.value);
    }

    const handleInicioChange = (e) => {
        setInicio(e.target.value);
    }

    const handleFinChange = (e) => {
        setFin(e.target.value);
    }

    const obtenerViajes = async () => {
        try {
            const res = await api.get(`${url}/viajes`);
            setViajes(res);
        } catch (error) {
            setErrorMessage('Error al obtener viajes');
        }
    };

    useEffect(() => {
        obtenerViajes();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (cedula === '' || placa === '' || inicio === '' || fin === '') {
            setErrorMessage('Por favor, llene todos los campos');
            return;
        }
    
        // Buscar chofer y vehículo
        let choferEncontrado = choferes.find(chofer => chofer.cedula === cedula);
        let vehiculoEncontrado = vehiculos.find(vehiculo => vehiculo.placa === placa);
    
        if (!choferEncontrado) {
            setErrorMessage('No se encontró el chofer seleccionado.');
            return;
        }
    
        if (!vehiculoEncontrado) {
            setErrorMessage('No se encontró el vehículo seleccionado.');
            return;
        }
    
        // Buscar puntos inicial y final
        let puntoInicialEncontrado = direcciones.find(direccion => direccion.id === inicio);
        let puntoFinalEncontrado = direcciones.find(direccion => direccion.id === fin);
    
        if (!puntoInicialEncontrado || !puntoFinalEncontrado) {
            setErrorMessage('No se encontraron los puntos seleccionados.');
            return;
        }
    
        // Verificar disponibilidad
        let viajeDisponible = !viajes.some(viaje => viaje.chofer === choferEncontrado.id || viaje.vehiculo === vehiculoEncontrado.id);
        if (!viajeDisponible) {
            setErrorMessage('El chofer o vehículo seleccionado no está disponible.');
            return;
        }
        console.log(viajes);
        console.log(viajeDisponible);
    
        // Construir datos del viaje
        const viajeData = {
            id: idViaje,
            chofer: choferEncontrado.id,
            vehiculo: vehiculoEncontrado.id,
            puntoInicial: puntoInicialEncontrado.id,
            puntoFinal: puntoFinalEncontrado.id,
        };

        console.log(choferEncontrado);
        console.log(vehiculoEncontrado);
        console.log(viajeData);
    
        try {
            const res = await api.post(`${url}/viajes`, { body: viajeData });
            if (!res.err) {
                // Convertimos JSON a String
                const number = choferEncontrado.telefono;
                const message = `Hola ${choferEncontrado.nombre},\n\n Se le ha asignado un nuevo viaje con el ID ${idViaje}.\n\nPor favor, diríjase a la oficina para más información.\n\nPunto de Partida: ${puntoInicialEncontrado.direccion}.\nPunto de Llegada: ${puntoFinalEncontrado.direccion}.\nVehiculo: ${vehiculoEncontrado.placa}\n\nGracias por su colaboración.`;
    
                const data = JSON.stringify({ number, message });
                const options = {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: data,
                };
    
                const response = await fetch(wppAPI, options);
                console.log(response);
                obtenerViajes();
    
                if (response.ok) {
                    setConfirmacion(true);
                    setErrorMessage('');
                } else {
                    setErrorMessage('Error al enviar mensaje');
                }
            } else {
                setErrorMessage('Error al asignar viaje');
            }
        } catch (error) {
            setErrorMessage('Error al asignar viaje');
        }
    };
    


    const handleClose = () => {
        setConfirmacion(false);
        // Reiniciar los datos
        setCedula('');
        setPlaca('');
    };

    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-overlay') {
            handleClose();
        }
    };

    return (
        <div>
            {confirmacion && (
                <div
                    id="modal-overlay"
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex items-center justify-center"
                    onClick={handleOutsideClick}
                >
                    <Confirmacion titulo={`Viaje #${idViaje} Asignado Correctamente`} />
                    <button
                        className="absolute top-3 right-3 text-red-500"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>
            )}
            <div className="w-7/12 flex flex-col rounded-xl p-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-black shadow-lg">
                <div className="items-center justify-center text-center mt-4 text-2xl">
                    <strong>Asignar Viaje</strong>
                </div>
                <form className="flex flex-col items-center justify-center text-center mt-7 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex items-center w-full">
                        <strong className="w-1/3 text-right">Chofer Asignado: </strong>
                        <input
                            type="text"
                            id="choferAsignado"
                            onChange={handleChoferChange}
                            value={cedula}
                            className="ml-4 w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex items-center w-full">
                        <strong className="w-1/3 text-right">Vehículo Asignado: </strong>
                        <input
                            type="text"
                            id="choferAsignado"
                            onChange={handleVehiculoChange}
                            value={placa}
                            className="ml-4 w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex items-center w-full">
                        <strong className="w-1/3 text-right">ID Viaje: </strong>
                        <input
                            type="text"
                            id="idViaje"
                            value={idViaje}
                            readOnly
                            className="ml-4 w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex items-center w-full">
                        <strong className="w-1/3 text-right">Punto Inicial: </strong>
                        <select
                            className="ml-4 w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={inicio}
                            onChange={handleInicioChange}
                        >
                            <option value="">Seleccione una opción</option>
                            {direcciones.map((direccion) => (
                                <option key={direccion.id} value={direccion.id}>{direccion.direccion}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center w-full">
                        <strong className="w-1/3 text-right">Punto Final: </strong>
                        <select
                            className="ml-4 w-1/3 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={fin}
                            onChange={handleFinChange}
                        >
                            <option value="">Seleccione una opción</option>
                            {direcciones.map((direccion) => (
                                <option key={direccion.id} value={direccion.id}>{direccion.direccion}</option>
                            ))}
                        </select>
                    </div>
                    {errorMessage && <Error prompt={errorMessage} />}
                    <div className="flex justify-center items-center w-full mt-6">
                        <button
                            type="submit"
                            className="w-1/4 px-4 py-2 bg-[#1A1A27] text-white font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Asignar Viaje
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AsignarViaje;
