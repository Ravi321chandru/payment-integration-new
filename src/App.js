import { useState, useEffect } from 'react';
import './style.css';

const RazorpayComponent = () => {
  const [customerId, setCustomerId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");

  const generateReceiptId = () => {
    const prefix = "order_rcptid_";
    const random = Date.now().toString();
    return `${prefix}${random}`;
  };

  useEffect(() => {
    const initializeRazorpay = async () => {
      try {
        const customerData = {
          name: name,
          contact: mobile,
          email: email,
          fail_existing: 0,
        };

        const customerResponse = await fetch("http://localhost:3000/https://api.razorpay.com/v1/customers", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('rzp_test_SqxHGtRgDOg8av:qnWT7rEGLNnIi9fbjyzq5UK8'),
          },
          body: JSON.stringify(customerData),
        });

        if (!customerResponse.ok) {
          const error = await customerResponse.json();
          console.error(`Razorpay customer creation failed: ${JSON.stringify(error)}`);
        } else {
          const customer = await customerResponse.json();
          setCustomerId(customer.id);
          console.log("Razorpay customer creation success:", customer);
        }

        const orderResponse = await fetch("http://localhost:3000/https://api.razorpay.com/v1/orders", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('rzp_test_Bv7ynRgcpldwRg:03SPtWNWANi7gLRTIPPjX4T3'),
          },
          body: JSON.stringify({
            amount: amount * 100,
            currency: "INR",
            receipt: generateReceiptId(), // Use the generated receipt ID here
          }),
        });

        if (!orderResponse.ok) {
          const error = await orderResponse.json();
          console.error(`Razorpay order creation failed: ${JSON.stringify(error)}`);
        } else {
          const order = await orderResponse.json();
          if (order.id) {
            setOrderId(order.id);
            console.log("Razorpay order creation success:", order);
          } else {
            console.error('Razorpay order creation failed:', order);
          }
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    initializeRazorpay();
  }, [name, amount, email, mobile]);

  const handlePayment = (e) => {
    e.preventDefault();
    if (amount === "") {
      alert("Please enter the amount.");
    } else {
      var options = {
        key: "rzp_test_SqxHGtRgDOg8av",
        amount: amount * 100,
        currency: "INR",
        name: "Payment Integration",
        description: "For shopping",
        handler: function (response) {
          if (response.razorpay_order_id) {
            alert("ORDER ID: " + response.razorpay_order_id);
          } else {
            alert("Order ID is not available");
          }

          alert("PAYMENT ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: name,
          email: email,
          contact: mobile,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        customer_id: customerId,
        order_id: orderId,
        save: 1,
      };

      var pay = new window.Razorpay(options);
      pay.open();
    }
  };

  return (
    <div>
      <div>
        <h2>Razor Pay Payment Integration</h2>
        <form>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <br />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <br />
          <button
            type="submit"
            onClick={handlePayment}
          >
            Submit Payment
          </button>
        </form>
      </div>
      <div>
        <p>Customer ID: {customerId}</p>
        <p>Order ID: {orderId}</p>
      </div>
    </div>
  );
};

export default RazorpayComponent;
