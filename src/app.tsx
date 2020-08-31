import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
    Earthbar,
    EarthstarKitCtx,
} from './earthbar';
import { Kit } from './kit';

//================================================================================
// LAYOUTS

let logLobbyApp = (...args : any[]) => console.log('lobby view |', ...args);

export interface LobbyProps {
}
export interface LobbyState {
}
export class LobbyApp extends React.Component<LobbyProps, LobbyState> {
    static contextType = EarthstarKitCtx;
    constructor(props: LobbyProps) {
        super(props);
    }
    render() {
        logLobbyApp('render');
        let kit = this.context as (Kit | null);
        return <div style={{padding: 'var(--s0)'}}>
            1 Hello this is the app content<br/><br/>
            2 Hello this is the app content<br/><br/>
            3 Hello this is the app content<br/><br/>
            4 Hello this is the app content<br/><br/>
            5 Hello this is the app content<br/><br/>
            6 Hello this is the app content<br/><br/>
            7 Hello this is the app content<br/><br/>
            8 Hello this is the app content<br/><br/>
            1 Hello this is the app content<br/><br/>
            2 Hello this is the app content<br/><br/>
            3 Hello this is the app content<br/><br/>
            4 Hello this is the app content<br/><br/>
            5 Hello this is the app content<br/><br/>
            6 Hello this is the app content<br/><br/>
            7 Hello this is the app content<br/><br/>
            8 Hello this is the app content<br/><br/>
            <pre>workspace address: {kit?.workspaceAddress || 'Choose a workspace'}</pre>
            <pre>user address: {kit?.authorKeypair?.address || 'Guest'}</pre>
        </div>;
    }
};

/*
export const App: React.FunctionComponent<any> = (props) =>
    <div style={{padding: 'var(--s0)'}}>
        1 Hello this is the app content<br/><br/>
        2 Hello this is the app content<br/><br/>
        3 Hello this is the app content<br/><br/>
        4 Hello this is the app content<br/><br/>
        5 Hello this is the app content<br/><br/>
        6 Hello this is the app content<br/><br/>
        7 Hello this is the app content<br/><br/>
        8 Hello this is the app content<br/><br/>
        9 Hello this is the app content
    </div>
*/

export const PageColumn: React.FunctionComponent<any> = (props) =>
    <div className='pageColumn'>{props.children}</div>;

//================================================================================
// MAIN

ReactDOM.render(
    <PageColumn>
        <Earthbar>
            <LobbyApp />
        </Earthbar>
    </PageColumn>,
    document.getElementById('react-slot')
);
