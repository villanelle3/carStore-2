import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function MainNav() {
    return (
        <Navbar expand="lg" className="bg-body-tertiary" fixed="top" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Car Store</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Comprar carro</Nav.Link>
                </Nav>
                <Nav className="ms-auto">
                    <Nav.Link href="#link" className="ml-auto">Login</Nav.Link> {/* Alterado para ml-auto */}
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MainNav;