import { useEffect, useState } from "react";
import AsignarViaje from "./AsignarViaje";
import helpHttp from "./helpHttp";

const Contenido = () => {
    const [choferes, setChoferes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [direcciones, setDirecciones] = useState([]);

    let api = helpHttp();
    let url = 'http://localhost:3001/'

    useEffect(() => {
        api.get(url + 'chofer').then((res) => {
            
            setChoferes(res);
            console.log(choferes);
        });
        api.get(url + 'vehiculos').then((res) => {
            setVehiculos(res);
            console.log(vehiculos);
        });
        api.get(url + 'direcciones').then((res) => {
            setDirecciones(res);
            console.log(direcciones);
        });
        
    },[])


    return (
        <div className='flex-grow flex justify-center items-center bg-gray-100'>
            <AsignarViaje choferes={choferes} vehiculos={vehiculos} direcciones={direcciones} />
        </div>
    );
}

export default Contenido;
