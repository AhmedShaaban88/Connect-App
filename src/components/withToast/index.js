import { useToasts } from 'react-toast-notifications'
import React from "react";

function withToast(Component) {
    return function WrappedComponent(props) {
        const toastFuncs = useToasts();
        return <Component {...props} {...toastFuncs} />;
    }
}
export default withToast;