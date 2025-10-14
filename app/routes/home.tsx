import FeaturedCoinsList from "~/components/FeaturedCoinsList"
import GlobalOverView from "~/components/GlobalOverview"

export default function Home() {
	
	return <div>
		<h1 className="text-xl px-8 pt-10 pb-7 font-bold">Dashboard</h1>
		<h3 className="text-lg px-8 pb-2">Featured</h3>
		<div className="overflow-x-hidden py-4">
			<FeaturedCoinsList />
		</div>
		<h3 className="text-lg px-8 py-4">Global Market</h3>
		<div className="px-8 pt-4 pb-6">
			<GlobalOverView />
		</div>
	</div>
}