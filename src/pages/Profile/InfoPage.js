import React, {useEffect, useState, Fragment} from "react";
import {Dimmer, Loader, Image} from "semantic-ui-react";
import BackendError from "../../components/BackendError";
import {getInfoData} from "../../utils/requests";
import {useParams} from "react-router";
import EditProfile from "./EditProfile";

export default function InfoPage() {
    const [isLoading, setLoading] = useState(true);
    const [backendError, setBackendError] = useState(null);
    const [user, setUser] =useState(null);
    const {id} = useParams();
    useEffect(() => {
        setLoading(true);
        setUser(null);
        getInfoData(id, setUser, setLoading, setBackendError);
    }, [id]);
    return  <Fragment>
        {isLoading && <Fragment>
            <Dimmer active inverted>
                <Loader inverted content='Loading' size='big'/>
            </Dimmer>

            <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        </Fragment>}
        {backendError && <BackendError error={backendError}/> }
        {user && <EditProfile user={user}/>}
    </Fragment>
}