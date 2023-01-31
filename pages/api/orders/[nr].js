import Order from "@/models/Order";
import mongodb from "../../../utils/mongodb";

export default async function handler(req, res) {
  const {
    method,
    query: { nr },
  } = req;
  await mongodb.dbConnect();

  if (method === "GET") {
    try {
      const order = await Order.findById(nr);
      res.status(200).json(order);
    } catch (error) {
      res.status(200).json(error);
    }
  }

  if (method === "PUT") {
    try {
      const order = await Order.findByIdAndUpdate(nr, req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === "DELETE") {
      try {
          const order = await Order.findByIdAndDelete(nr);
          res.status(200).json(order);
      } catch (error) {
          res.status(500).json(error);
      }
  }
}
