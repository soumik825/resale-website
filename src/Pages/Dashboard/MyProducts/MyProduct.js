import { useQuery } from '@tanstack/react-query';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthProvider';
import ConfirmationModal from '../../Sheard/ConfirmationModal/ConfirmationModal';

const MyProduct = () => {
    const { user } = useContext(AuthContext);
    const [deleteUser, setDeleteUser] = useState(null);
    // console.log(user.uid);
    const closeModal = () => {
        setDeleteUser(null);
    }


    // load all product in clinte
    const url = `  https://poridhan-com-server-soumik825.vercel.app/myproducts/${user.uid}`;
    const { data: products = [], refetch } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            try {
                const res = await fetch(url, {
                    headers: {
                        authorization: `bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                const data = await res.json();
                return data;
            }
            catch (error) {
                console.log(error);
            }

        }
    })
    // console.log(products);
    const deleteUserDB = products => {
        fetch(`  https://poridhan-com-server-soumik825.vercel.app/products/${products._id}`, {
            method: 'DELETE',
            headers: {
                authorization: `bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    toast.success('Successfull Delete ');
                    closeModal(null);
                    refetch();

                }
            })

    }


    const handleAdds = id => {
        fetch(`  https://poridhan-com-server-soumik825.vercel.app/adds/${id}`, {
            method: 'PUT'
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                toast.success('Product Add On Home Successfully.');
                refetch();

            })
    }


    return (
        <div>
            <h2 className='text-primary text-2xl  font-bold'>My All Product : {products.length}</h2>
            <div>

                <div className="overflow-x-auto w-full">
                    <div>
                        <Link to={'/dashboard/advertice'} className='btn btn-primary my-10'>Add A Advertisement On Home Page </Link>
                    </div>
                    <table className="table w-full">
                        <thead>
                            <tr>

                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Email</th>
                                <th>Date</th>
                                <th>Do Advertise</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                products.map(product => <tr key={product._id}>
                                    <td>
                                        <div className="avatar">
                                            <div className="w-32 rounded">
                                                <img alt='' src={product.photo} />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-3">

                                            <div>
                                                <div className="font-bold">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {product.email ? product.email : user.uid}
                                    </td>
                                    <td>{product.date}</td>
                                    <td>{product.addvertise === "false" ? <button onClick={() => handleAdds(product._id)} className="btn  btn-primary btn-xs">Addvertise</button> : <>ADD Showing</>
                                    }
                                    </td>
                                    <th>
                                        <label htmlFor="modal" onClick={() => setDeleteUser(product)} className="btn  btn-ghost btn-xs">Delete</label>

                                    </th>
                                </tr>)
                            }

                        </tbody>

                    </table>
                    {
                        deleteUser && <ConfirmationModal
                            title={`Want To Delete User ?`}
                            message={`If You Delete ${deleteUser.name} . It can not be restore.`}
                            classs={`btn btn-error`}
                            closeModal={closeModal}
                            deleteUserDB={deleteUserDB}
                            data={deleteUser}
                            btnName="Delete"
                        ></ConfirmationModal>
                    }
                </div>




            </div>
        </div>
    );
};

export default MyProduct;