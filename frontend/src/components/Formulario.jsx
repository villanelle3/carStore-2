import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { NumericFormat } from 'react-number-format';

const Formulario = ({ existingCar = {}, updateCallBack }) => {
    const [nome, setNome] = useState(existingCar.nome || "");
    const [marca, setMarca] = useState(existingCar.marca || "");
    const [modelo, setModelo] = useState(existingCar.modelo || "");
    const [preco, setPreco] = useState(existingCar.preco || "");
    const [foto, setFoto] = useState(null);

    const updating = Object.entries(existingCar).length !== 0;

    // Função para limpar o valor de preço
    const limparPreco = (preco) => {
        // Verificar se o preço não é uma string
        if (typeof preco !== 'string') {
            return preco;
        }

        // Remover caracteres não numéricos, exceto vírgulas e pontos
        const precoLimpo = preco.replace(/[^0-9,.]+/g, '');

        // Substituir vírgulas por pontos para garantir um formato de número válido
        const precoNumerico = precoLimpo.replace(',', '.');

        // Converter a string em um número de ponto flutuante
        return parseFloat(precoNumerico);
    };

    useEffect(() => {
        // Limpar o valor do preço apenas quando estiver atualizando o formulário
        if (updating) {
            setPreco(limparPreco(preco));
        }
    }, [updating, preco]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('marca', marca);
        formData.append('modelo', modelo);
        formData.append('preco', preco);

        if (foto) {
            formData.append('foto', foto);
        }

        const url = "http://127.0.0.1:5000/" + (updating ? `update_info/${existingCar.id}` : "create_car");
        const options = {
            method: updating ? "PATCH" : "POST",
            body: formData
        };
        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json();
            alert(data.message);
        } else {
            updateCallBack();
            setNome("");
            setMarca("");
            setModelo("");
            setPreco("");
            setFoto(null);
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
                <NumericFormat
                    value={preco}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    onValueChange={(values) => setPreco(values.formattedValue)}
                    className="form-control"
                    placeholder="Preço"
                    required
                />
            </Form.Group>
            <Form.Group controlId="foto">
                <Form.Control
                    type="file"
                    onChange={(e) => setFoto(e.target.files[0])}
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
