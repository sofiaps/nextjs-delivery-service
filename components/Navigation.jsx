import Link from "next/link";
import Image from "next/image";
import { Badge } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Navigation() {
  const cartQty = useSelector((state) => state.cart.cartQty);
  return (
    <div className="shadow sticky-top p-2 mb-2 bg-danger">
      <div className="d-flex justify-content-between align-items-center">
        <Link href="/">
          <Image src={"/images/logo.png"} alt="logo" width={180} height={75} />
        </Link>
        <Link href="/cart">
          <Image src={"/images/cart.png"} alt="cart" width={30} height={30} />
          {cartQty > 0 && (
            <Badge
              pill
              bg="success"
              style={{ position: "absolute", right: "25px", top: "25px" }}
            >
              {cartQty}
            </Badge>
          )}
        </Link>
      </div>
    </div>
  );
}
