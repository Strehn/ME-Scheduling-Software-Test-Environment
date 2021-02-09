import React, { Component } from 'react'
import Navbar from '../components/Navigation/ResNavbar';

class Layout extends Component {
    render() {
        return (
            <div>
                <Navbar />
                <main>
                    {this.props.children}
                </main>
            </div>
        )
    }
}

export default Layout;
