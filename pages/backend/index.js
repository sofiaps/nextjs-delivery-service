import { Table, Button, CloseButton } from "react-bootstrap";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

export default function Bestellung({ orders }) {
  const router = useRouter();
  const status = ["Received", "Preparing", "On the way", "Delivered"];

  const statusUpdate = async (id, currentStatus) => {
    try {
      if (currentStatus <= 2) {
        await axios.put(`http://localhost:3000/api/orders/` + id, {
          status: currentStatus + 1,
        });
        router.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/orders/` + id);
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Admin Backend</h1>
      <div className="row mt-4">
        <div className="col-12">
          <Table hover responsive>
            <thead>
              <tr>
                <th>Order Nr.</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            {orders.map((order) => (
              <tbody key={order._id}>
                <tr>
                  <td>
                    <Link
                      className="text-danger"
                      href={`/orders/${order._id}`}
                    >
                      {order._id}
                    </Link>
                  </td>
                  <td>{order.customer}</td>
                  <td>{order.address}</td>
                  <td>
                    <Button
                      onClick={() => statusUpdate(order._id, order.status)}
                    >
                      {status[order.status]}
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => removeOrder(order._id)}
                    >
                      x
                    </Button>
                  </td>
                </tr>
              </tbody>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}


export async function getServerSideProps(ctx) {
    const myCookie = ctx.req?.cookies || "";
    if (myCookie.token !== process.env.TOKEN) {
        return {
            redirect: {
                destination: "/backend/login",
                permant: false
            }
        }
    }
    const res = await axios.get(`http://localhost:3000/api/orders`);
    return {
        props: { orders: res.data },
    };
}