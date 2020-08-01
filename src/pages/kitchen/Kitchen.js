import React, { useState, useEffect } from "react";
import firebase from "../../firebase-config";
import {Link} from 'react-router-dom'
import Button from '../../components/button/button';
import './Kitchen.css'
import logo from "../../assets/logo.svg";
import Image from '../../components/image/image'
import exit from "../../assets/exit.svg";
import "firebase/firebase-auth";
import "firebase/firebase-firestore";
import Order from "../../components/menu/order";
import OrderItem from "../../components/menu/OrderItem";


const Kitchen = () => {
  const [done, setDone] = useState([]);
  const [pending, setPending] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    firebase
    .firestore()
    .collection("orders")
    .get().then((snapshot)=>{
      const pedidos = snapshot.docs.map((doc) =>({
        id: doc.id,
        ...doc.data() 
        //doc.data pega todos os itens dentro do pedido
      })) 
      setOrders(pedidos)

      setPending(pedidos.filter(doc => doc.status === false))
       setDone(pedidos.filter(doc => doc.status === 'done'))
    })
  },[])

  function orderDone(item){
      firebase
      .firestore()    
      .collection('orders')
      .doc(item.id)
      .update({
        ready: true,
        time: new Date().getTime()
      })

      const newPending = pending.filter((el) => el.id !== item.id);
      setPending(newPending);

      const newDone = [...done, {...item, status: 'done', time: new Date().getTime()}];
      setDone(newDone);

      
  }; 



  return (
    <div className='div-kitchen'>
      <nav className='nav-kitchen'>
        <figure className='figure-kitchen'>
          <Image src={logo} alt='logo' class='logo-kitchen' />
        </figure>
        <h1 className ='h1-kitchen'>BURGER QUEEN</h1>
        <Link to='/login' >
        <button
          className='button-exit'
          name='EXIT'
          onClick={() => firebase.auth().signOut()}
        >
          <Image src={exit} alt='exit' class='exit-image' />
        </button>
        </Link> 
      </nav>
      <section className='section-kitchen'>
        <div className='div-orderRecived'>
        <h1 className='h1-orders'>PEDIDOS PENDENTES</h1>
        <div>
          {orders.map((item)=> (
            <div className="div-order1">
              <Button name='PRONTO' onClick={(e) => {
                orderDone(item)
                e.preventDefault()
              }} />
              {item.name}
              {(item.order).map((i)=>(
                <div>{i.count}
                {i.item}
                 </div>
              ))}
            </div>
          ))}

        </div>
        </div>
        <div className='div-orderFinished'>
         <h1 className='h1-orders'>PEDIDOS PRONTOS</h1>
        </div>
      </section>
      </div> 
  );
};

export default Kitchen;
