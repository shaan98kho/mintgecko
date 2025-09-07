import FeaturedCoinsList from "~/components/FeaturedCoinsList"
import GlobalOverView from "~/components/GlobalOverview"

export default function Home() {
	
	return <div>
		<h2 className="text-lg">Featured</h2>
		<div className="">
			<FeaturedCoinsList />
		</div>
		<div className="">
			<GlobalOverView />
		</div>
	</div>
}