import React, {useState, useEffect} from 'react';

function App() {
    const [products, setProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        id: null,
        product_name: '',
        product_amount: '',
        product_quantity: '',
        product_image: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddProduct = async (formData) => {
        try {
            await axios.post('products', formData);
            fetchProducts();
            setShowAddModal(false);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleEditProduct = async (formData) => {
        try {
            formData.append('_method', 'PUT');
            formData.append('product_name', currentProduct.product_name);
            formData.append('product_amount', currentProduct.product_amount);
            formData.append('product_quantity', currentProduct.product_quantity);
            formData.append('product_image', currentProduct.product_image);

            await axios.post(`products/${currentProduct.id}`, formData);
            fetchProducts();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error editing product:', error);
        }
    };



    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`products/${id}`);
            fetchProducts();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setShowEditModal(true);
    };

    const openDeleteModal = (product) => {
        setCurrentProduct(product);
        setShowDeleteModal(true);
    };

    return (
        <div style={{padding: '20px'}}>
            <h1>Product List</h1>
            <button onClick={() => setShowAddModal(true)} style={{marginBottom: '20px'}}>Add Product</button>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                <tr>
                    <th style={{border: '1px solid black', padding: '8px'}}>ID</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Name</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Amount</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Quantity</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Image</th>
                    <th style={{border: '1px solid black', padding: '8px'}}>Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td style={{border: '1px solid black', padding: '8px'}}>{product.id}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{product.product_name}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{product.product_amount}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>{product.product_quantity}</td>
                        <td style={{border: '1px solid black', padding: '8px'}}>
                            <img src={product.product_image} alt={product.product_name}
                                 style={{width: '50px', height: '50px'}}/>
                        </td>
                        <td style={{border: '1px solid black', padding: '8px'}}>
                            <button onClick={() => openEditModal(product)} style={{marginRight: '10px'}}>Edit</button>
                            <button onClick={() => openDeleteModal(product)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>


            {showAddModal && (
                <Modal onClose={() => setShowAddModal(false)}>
                    <h2>Add Product</h2>
                    <ProductForm onSave={handleAddProduct}/>
                </Modal>
            )}


            {showEditModal && (
                <Modal onClose={() => setShowEditModal(false)}>
                    <h2>Edit Product</h2>
                    <ProductForm product={currentProduct} onSave={handleEditProduct}/>
                </Modal>
            )}


            {showDeleteModal && (
                <Modal onClose={() => setShowDeleteModal(false)}>
                    <h2>Delete Product</h2>
                    <p>Are you sure you want to delete {currentProduct.product_name}?</p>
                    <button onClick={() => handleDeleteProduct(currentProduct.id)}>Yes</button>
                    <button onClick={() => setShowDeleteModal(false)}>No</button>
                </Modal>
            )}
        </div>
    );
}

function Modal({children, onClose}) {
    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>
                {children}
            </div>
        </div>
    );
}

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        position: 'relative',
        width: '300px',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
    },
};

function ProductForm({product = {product_name: '', product_amount: '', product_quantity: ''}, onSave}) {
    const [productName, setProductName] = useState(product.product_name);
    const [productAmount, setProductAmount] = useState(product.product_amount);
    const [productQuantity, setProductQuantity] = useState(product.product_quantity);
    const [productImage, setProductImage] = useState(product.product_image);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('product_name', productName ?? '');
        formData.append('product_amount', productAmount ?? '');
        formData.append('product_quantity', productQuantity ?? '');
        formData.append('product_image', productImage ?? '');

        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required
                       style={{width: '100%', padding: '8px', marginBottom: '10px'}}/>
            </div>
            <div>
                <label>Amount</label>
                <input type="text" value={productAmount} onChange={(e) => setProductAmount(e.target.value)} required
                       style={{width: '100%', padding: '8px', marginBottom: '10px'}}/>
            </div>
            <div>
                <label>Quantity</label>
                <input type="number" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)}
                       required style={{width: '100%', padding: '8px', marginBottom: '10px'}}/>
            </div>
            <div>
                <label>Image</label>
                <input type="file" onChange={(e) => setProductImage(e.target.files[0])} accept="image/*"
                       style={{marginBottom: '10px'}}/>
            </div>
            <button type="submit" style={{
                padding: '10px 20px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
            }}>Save
            </button>
        </form>
    );
}

export default App;
