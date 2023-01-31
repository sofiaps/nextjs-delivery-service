import { Table, Spinner, Button, Card } from "react-bootstrap";
import { useRouter } from "next/router";
import axios from "axios";

export default function Order({ order }) {
  const router = useRouter();
  const { nr } = router.query;

  let status;
  switch (order.status) {
    case 0:
      status = "Received";
      break;
    case 1:
      status = "Preparing";
      break;
    case 2:
      status = "On the way";
      break;
    case 3:
      status = "Delivered";
      break;
  }

  if (nr !== order._id) {
    return (
      <div>
        <h2>Order number {nr} not available</h2>
        <Button variant="primary" onClick={() => router.push("/")}>
          To Menu
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Order status</h1>
        <div className="row mt-4">
          <div className="col-9">
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Order Nr.</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{nr}</td>
                  <td>{order.customer}</td>
                  <td>{order.address}</td>
                  <td>
                    <span>{status} </span>
                    {order.status < 3 ? (
                      <Spinner animation="border" variant="success" size="sm" />
                    ) : (
                      <span>✔️</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Extras</th>
                                    <th>Qty.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.products.map((product)=>(
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>
                                        {product.extras.map((extra)=>(
                                            <span key={extra._id}>{extra} </span>
                                        ))}
                                    </td>
                                    <td>{product.qty}</td>
                                </tr>
                                ))}
                            </tbody>
                        </Table>
          </div>
          <div className="col-3 p-2">
            <div className="shadow">
              <Card>
                <Card.Header as="h5">Total</Card.Header>
                <Card.Body className="text-center">
                  <Card.Title>{order.amount.toFixed(2)} EUR</Card.Title>
                  {order.payment === 0 ? (
                    <Button variant="danger disabled">open</Button>
                  ) : (
                    <Button variant="success disabled">paid</Button>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export async function getServerSideProps({ params }) {
  const res = await axios.get(`http://localhost:3000/api/orders/${params.nr}`);
  return {
    props: { order: res.data },
  };
}
