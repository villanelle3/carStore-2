import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Formulario = ({ existingCar = {}, updateCallBack }) => {
    const [nome, setNome] = useState(existingCar.nome || "");
    const [marca, setMarca] = useState(existingCar.marca || "");
    const [modelo, setModelo] = useState(existingCar.modelo || "");
    const [preco, setPreco] = useState(existingCar.preco || "");
    const [foto, setFoto] = useState(existingCar.foto || "");

    const updating = Object.entries(existingCar).length !== 0

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const precoNumber = parseFloat(preco);
    
        const data = { nome, marca, modelo, preco: precoNumber, foto };
        const url = "http://127.0.0.1:5000/" + (updating ? `update_info/${existingCar.id}` : "create_car");
        const options = {
            method: updating ? "PATCH" : "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }
        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200){
            const data = await response.json();
            alert(data.message);
        } else {
            updateCallBack()
            setNome("");
            setMarca("");
            setModelo("");
            setPreco("");
            setFoto("");
        }   
    };
    
    return (
        <Form onSubmit={handleSubmit}>
            <h4 className='mb-4'>{updating ? "Atualizar informações" : "Adicionar novo carro"}</h4>
            <Form.Group controlId="nome">
                <Form.Control 
                    type="text" 
                    placeholder="Nome"
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)}  
                    required
                />
            </Form.Group>
            <Form.Group controlId="marca">
                <Form.Control 
                    type="text" 
                    placeholder="Marca"
                    value={marca} 
                    onChange={(e) => setMarca(e.target.value)}  
                    required
                />
            </Form.Group>
            <Form.Group controlId="modelo">
                <Form.Control 
                    type="text" 
                    placeholder="Modelo"
                    value={modelo} 
                    onChange={(e) => setModelo(e.target.value)}  
                    required
                />
            </Form.Group>
            <Form.Group controlId="preco">
                <Form.Control 
                    type="number" 
                    placeholder="Preço"
                    value={preco} 
                    onChange={(e) => setPreco(e.target.value)}  
                    required
                />
            </Form.Group>
            <Form.Group controlId="foto">
                <Form.Control 
                    type="text" 
                    placeholder="Foto"
                    value={foto} 
                    onChange={(e) => setFoto(e.target.value)}  
                />
            </Form.Group>
            <Button variant="primary" type="submit">Enviar</Button>
        </Form>
    );
};

Formulario.propTypes = {
    existingCar: PropTypes.object,
    updateCallBack: PropTypes.func.isRequired
};

export default Formulario;
