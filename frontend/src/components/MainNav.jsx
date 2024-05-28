import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MainNav({ user, isLoggedIn, onLogout }) {
    return (
        <Navbar expand="lg" className="bg-body-tertiary" fixed="top" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Car Store</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Comprar carro</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto">
                        {isLoggedIn ? (
                            <>
                                <Navbar.Text>
                                    Logado como: {user}
                                </Navbar.Text>
                                <Nav.Link onClick={onLogout}>Logout</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MainNav;
