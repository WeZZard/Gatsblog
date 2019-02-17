import React from 'react'
import styles from './Menu.module.scss'

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.toggle= this.toggle.bind(this);
        this.handleScroll= this.handleScroll.bind(this);
        this.state = {
            open: false,
            pageYOffset: 0,
        };
    }

    toggle() {
        const isOpen = this.state.open;
        const pageYOffset = this.state.pageYOffset;
        this.setState({ open: !isOpen, pageYOffset });
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, { passive: true })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll(event) {
        const isOpen = this.state.open;
        this.setState({ open: isOpen, pageYOffset: window.pageYOffset });
    }

    render(props) {
        const { open: isOpen, pageYOffset } = this.state;

        let menuClassNames = [styles.menu];

        if (isOpen) {
            menuClassNames.push(styles.open);
        } else {
            if (pageYOffset > 0) {
                menuClassNames.push(styles.bordered);
            }
        }

        const menuClassName = menuClassNames.join(' ');
        return <nav className={menuClassName}>
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
