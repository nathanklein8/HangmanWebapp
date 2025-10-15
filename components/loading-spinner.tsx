import { LucideLoader2 } from "lucide-react";

const LoadingSpinner = () => {
    return (
        <div className='spinnerContainer'>
            <LucideLoader2 className="spinner" size={48}/>
        </div>
    );
};

export default LoadingSpinner;