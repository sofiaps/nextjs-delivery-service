import { Carousel } from "react-bootstrap"
import Image from "next/image"

export default function Slider() {
    return (
        <div className="container">
            <Carousel controls={false} fade={true}>
                <Carousel.Item>
                    <Image className="d-block w-100 rounded-3" src='/images/food/burger.jpg' alt="burger" width={3000} height={400} />
                </Carousel.Item>
                <Carousel.Item>
                    <Image className="d-block w-100 rounded-3" src='/images/food/pizza.jpg' alt="pizza" width={3000} height={400} />
                </Carousel.Item>
                <Carousel.Item>
                    <Image className="d-block w-100 rounded-3" src='/images/food/burrito.jpg' alt="burrito" width={3000} height={400} />
                </Carousel.Item>
            </Carousel>
        </div>
    )
}
