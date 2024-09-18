import ReviewsForm from "./reviews-form";

export default async function Reviews ({productId} : {productId: number}) {
    return(
        <section className="py-8">
            <h2 className="text-2xl font-semibold mb-3">Product Reviews</h2>
            <div>
                <ReviewsForm />
            </div>
        </section>
    )
}