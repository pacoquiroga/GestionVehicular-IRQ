/* eslint-disable react/prop-types */

const Confirmacion = ({titulo}) => {
    return (
        <div>
            <div className="relative max-w-lg mx-auto overflow-hidden rounded-lg bg-white shadow-xl">
                <button className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 bg-white text-black border-2 border-gray-300 text-lg font-light rounded-lg transition-colors duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white" type="button">×</button>
                <div className="relative text-center bg-teal-400 rounded-t-lg py-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-teal-200 rounded-full mx-auto animate-pulse">
                        <svg className="text-teal-500 w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 7L9.00004 18L3.99994 13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                </div>
                <div className="p-4 text-center">
                    <span className="text-green-700 text-lg font-semibold">{titulo}</span>
                </div>
            </div>
        </div>
    )
}

export default Confirmacion
