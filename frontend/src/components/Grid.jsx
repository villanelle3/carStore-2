import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Grid() {
    return (
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src="https://lh6.googleusercontent.com/proxy/BcbAANx2DLlpiYse_0JkjLIByEmsbRqECUAvRBsziC4ia8LAhIRtRgiIIzQbTQksvXFNauKctLBWLmvcox8A1PzxhNKF_6_xDOg6vZRGNrAfAkavC5njomAqRgTTUzeOJnPpImDQyxcSm_dOFngzcec7uPEm6x09mxssFG1Kdjyn4mGJmfmrNQ0diSnGhGPEsb4blBxyJTo2Kmvjv2neSgDYsaHAjgfqBOg1c1lSEfbthzd5ho_gYk4Mw79IqgDIwsKjOCqk4A" />
        <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the cards content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
        </Card.Body>
        </Card>
    );
}

export default Grid;