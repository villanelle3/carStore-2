import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholderImage from './placeholder.png'; 

function ListaDeCarros({ carros, isLoading, error, updateCar, updateCallBack }) {
    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://127.0.0.1:5000/delete_carro/${id}`, options);
            if (response.status === 200) {
                updateCallBack();
            } else {
                console.error("Algum erro aconteceu");
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            {isLoading ? (
                <p>Carregando carros...</p>
            ) : error ? (
                <p>Ocorreu um erro: {error}</p>
            ) : (
                <Row xs={1} md={3} className="g-4">
                    {carros
                        .sort((x, y) => x.preco - y.preco) // Ordena os carros por ordem de valor
                        .map((carro, index) => (
                            <Col key={index}>
                                <Card style={{ width: '18rem' }}>
                                    <div style={{ height: '200px', overflow: 'hidden' }}>
                                        <Card.Img variant="top" src={carro.foto || placeholderImage} onError={(e) => { e.target.src = placeholderImage }} alt="Foto do carro" style={{ width: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{carro.marca} &#8226; {carro.modelo}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{carro.nome}</Card.Subtitle>
                                        <Card.Text>
                                            <span>Preço à vista</span>
                                            <h5>R$ <span>{carro.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></h5>
                                        </Card.Text>
                                        <Button onClick={() => updateCar(carro)} variant="primary" className="mx-2">Update</Button>
                                        <Button onClick={() => onDelete(carro.id)} variant="danger" className="mx-2">Delete</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                </Row>
            )}
        </div>
    );
}

ListaDeCarros.propTypes = {
    carros: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    updateCar: PropTypes.func.isRequired,
    updateCallBack: PropTypes.func.isRequired
};

export default ListaDeCarros;
