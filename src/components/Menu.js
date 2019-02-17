import React from 'react'
import styles from './Menu.module.scss'

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.toggle= this.toggle.bind(this);
        this.state = {
            open: false,
        };
    }

    toggle() {
        console.log('hehe');
        const currentState = this.state.open;
        this.setState({ open: !currentState });
    };

    render(props) {
        const isOpen = this.state.open;
        const className = isOpen
            ? [styles.menu, styles.open].join(' ')
            : styles.menu;
        return <nav className={className}>
            <div className={styles.burgerContainer}>
                <div className={styles.burger} onClick={this.toggle}>
                    <div className={styles.topBar}/>
                    <div className={styles.btmBar}/>
                </div>
            </div>
            <ul className={styles.list}>
                <li className={styles.listItem}><a href="#">Mac</a></li>
                <li className={styles.listItem}><a href="#">iPad</a></li>
                <li className={styles.listItem}><a href="#">iPhone</a></li>
                <li className={styles.listItem}><a href="#">Watch</a></li>
                <li className={styles.listItem}><a href="#">TV</a></li>
                <li className={styles.listItem}><a href="#">Music</a></li>
                <li className={styles.listItem}><a href="#">Support</a></li>
            </ul>
        </nav>
    }
}

export default Menu
