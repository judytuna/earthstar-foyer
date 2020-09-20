import * as React from 'react';

import {
    ValidatorEs4,
    isErr,
    notErr,
    AuthorKeypair,
} from 'earthstar';

import {
    WorkspaceConfig,
    EarthbarStore,
} from './earthbarStore';
import {
    cutAtPeriod,
    sortByField,
} from './util';
import {
    logEarthbarPanel,
} from './log';

//================================================================================

let sUserPanel : React.CSSProperties = {
    padding: 'var(--s0)',
    // change colors
    '--cBackground': 'var(--cUser)',
    '--cText': 'var(--cWhite)',
    // apply color variables
    background: 'var(--cBackground)',
    color: 'var(--cText)',
    borderTopLeftRadius: 'var(--round)',
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 'var(--round)',
    borderBottomRightRadius: 'var(--round)',
    boxShadow: '0px 13px 10px 0px rgba(0,0,0,0.3)',
} as React.CSSProperties;

//================================================================================
// COMPONENTS

interface EbPanelProps {
    store: EarthbarStore,
}
interface EbUserPanelState {
    shortnameInput: string,
    usernameInput: string,
    passwordInput: string,
    loginError: string,
    displayNameInput: string,
}
export class EarthbarUserPanel extends React.Component<EbPanelProps, EbUserPanelState> {
    constructor(props: EbPanelProps) {
        super(props)
        this.state = {
            shortnameInput: '',
            usernameInput: '',
            passwordInput: '',
            loginError: '',
            displayNameInput: this.props.store.currentUser?.displayName || '',
        };
    }
    //-------------------------
    // create user
    shortnameIsValid(shortname: string) {
        let fakeAddr = '@' + shortname + '.bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        let parsed = ValidatorEs4.parseAuthorAddress(fakeAddr);
        return notErr(parsed);
    }
    canCreateUser() {
        let shortname = this.state.shortnameInput;
        return shortname && this.shortnameIsValid(shortname);
    }
    handleEditShortname(val: string) {
        this.setState({shortnameInput: val.trim()});
    }
    handleCreateUser() {
        let shortname = this.state.shortnameInput;
        if (this.shortnameIsValid(shortname)) {
            this.props.store.createUser(this.state.shortnameInput);
            this.setState({shortnameInput: ''});
            /*
            // HACK to try to get 1password to recognize the fake fields
            let u = document.getElementById('fakeUsername');
            let p = document.getElementById('fakePassword');
            setTimeout(() => {
                if (!u || !p) { return; }
                u.click();
                u.focus();
                u.setAttribute('value', 'abc');
                setTimeout(() => {
                if (!u || !p) { return; }
                    p.click();
                    p.focus();
                    p.setAttribute('value', 'def');
                    setTimeout(() => {
                        this.props.store.createUser(this.state.shortnameInput);
                        this.setState({shortnameInput: ''});
                    }, 1000);
                }, 1000);
            }, 1);
            */
        } else {
            console.warn('invalid shortname: ' + shortname);
        }
    }
    //-------------------------
    // log in
    handleEditUsername(val: string) {
        this.setState({usernameInput: val.trim(), loginError: ''});
    }
    handleEditPassword(val: string) {
        this.setState({passwordInput: val.trim(), loginError: ''});
    }
    canLogIn(): boolean {
        return this.state.usernameInput.length > 0 && this.state.passwordInput.length > 0;
    }
    handleLogIn() {
        let keypair: AuthorKeypair = {
            address: this.state.usernameInput,
            secret: this.state.passwordInput,
        }
        let success = this.props.store.logIn(keypair);
        if (isErr(success)) {
            this.setState({loginError: 'Invalid username or password'});
        } else {
            this.setState({
                usernameInput: '',
                passwordInput: '',
                loginError: '',
            });
        }
    }
    //-------------------------
    // for logged-in users
    handleCopy(val: string) {
        logEarthbarPanel('copying value to clipboard: ' + val);
        navigator.clipboard.writeText(val);
    }
    handleSaveDisplayName() {
        logEarthbarPanel('saving display name');
        this.props.store.setDisplayName(this.state.displayNameInput.trim());
    }
    handleLogOut() {
        logEarthbarPanel('logging out');
        this.props.store.logOutUser();
    }
    //-------------------------
    render() {
        logEarthbarPanel('render user panel');
        let store = this.props.store;

        if (store.currentUser === null) {
            return <div className='stack' style={sUserPanel}>
                {/* form to create new user */}
                <div className='faint'>Create new user</div>
                <form className='flexRow indent' onSubmit={(e) => {e.preventDefault(); this.handleCreateUser()}}>
                    <input className='flexItem flexGrow1' type='text'
                        placeholder='4-letter nickname'
                        maxLength={4}
                        value={this.state.shortnameInput}
                        onChange={(e) => this.handleEditShortname(e.target.value)}
                        />
                    <button className='button flexItem'
                        type='submit'
                        id='createUser'
                        style={{marginLeft: 'var(--s-1)'}}
                        disabled={!this.canCreateUser()}
                        >
                        Create
                    </button>
                    {/* fake inputs for 1password
                    <input className='flexItem flexGrow1' type='text'
                        name='username' id='fakeUsername'
                        />
                    <input className='flexItem flexGrow1' type='password'
                        name='password' id='fakePassword'
                        />
                    */}
                </form>
                <div className='faint indent'>
                    We'll create a new, unique username and password for you.
                    After clicking Create, be sure to save your username and
                    password so you can log in again later!
                </div>
                <hr className='faint'/>
                {/* form to log in */}
                <div className='faint'>Log in</div>
                <form className='stack indent' onSubmit={(e) => {e.preventDefault(); this.handleLogIn()}}>
                    <div className='flexRow'>
                        <input className='flexItem flexGrow1' type="text"
                            name='username' id='loginUsername'
                            placeholder='@user.xxxxxxxxxxxxxxx'
                            onChange={(e) => this.handleEditUsername(e.target.value)}
                            />
                    </div>
                    <div className='flexRow'>
                        <input className='flexItem flexGrow1' type='password'
                            name='password' id='loginPassword'
                            placeholder='password'
                            onChange={(e) => this.handleEditPassword(e.target.value)}
                            />
                        <button className='button flexItem'
                            type='submit'
                            id='logIn'
                            style={{marginLeft: 'var(--s-1)'}}
                            disabled={!this.canLogIn()}
                            >
                            Log in
                        </button>
                    </div>
                    <div className='indent right'>{this.state.loginError}</div>
                </form>
            </div>;
        } else {
            // user is logged in
            return <div className='stack' style={sUserPanel}>
                <div className='faint'>Display name in this workspace</div>
                <form className='indent flexRow' onSubmit={(e) => {e.preventDefault(); this.handleSaveDisplayName()}}>
                    <input type='text' className='flexGrow1'
                        value={this.state.displayNameInput}
                        onChange={(e) => this.setState({displayNameInput: e.target.value})}
                        />
                    <button className='button flexItem'
                        type='submit'
                        style={{marginLeft: 'var(--s-1)'}}
                        >
                        Save
                    </button>
                </form>
                <hr className='faint' />
                <div className='faint'>Username</div>
                <div className='indent flexRow'>
                    <pre className='flexGrow1' style={{
                            whiteSpace: 'break-spaces',
                            overflowWrap: 'break-word',
                            margin: 0, padding: 0,
                        }}>
                        {store.currentUser.authorKeypair.address}
                    </pre>
                    <button className='button flexItem' type='button'
                        style={{marginLeft: 'var(--s-1)'}}
                        onClick={() => this.handleCopy(store.currentUser?.authorKeypair.address || '')}
                        >
                        Copy
                    </button>
                </div>
                <div className='faint'>Password</div>
                <div className='indent flexRow'>
                    <pre className='flexGrow1 faint' style={{
                            whiteSpace: 'break-spaces',
                            overflowWrap: 'break-word',
                            margin: 0, padding: 0,
                        }}>
                        •••••••••••••••••••••••••••••••••••••••••••••••••••••
                    </pre>
                    <button className='button flexItem' type='button'
                        style={{marginLeft: 'var(--s-1)'}}
                        onClick={() => this.handleCopy(store.currentUser?.authorKeypair.secret || '')}
                        >
                        Copy
                    </button>
                </div>
                <hr className='faint' />
                <div className='center'>
                    <button className='button' type='button'
                        onClick={() => this.handleLogOut()}
                        >
                        Log out
                    </button>
                </div>
                <div className='faint'>
                    Make sure to save your username and password before you log out!
                    There's no way to reset a lost password.
                </div>
            </div>;
        }
    }
}
