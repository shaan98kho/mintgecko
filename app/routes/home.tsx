import FeaturedCoinsList from "~/components/FeaturedCoinsList"
import GlobalOverView from "~/components/GlobalOverview"

export default function Home() {
	
	return <div>
		<h1 className="text-xl px-4 py-8 font-bold">Dashboard</h1>
		<h3 className="text-lg px-4">Featured</h3>
		<div className="overflow-hidden min-w-0">
			<FeaturedCoinsList />
		</div>
		<h3 className="text-lg px-4">Global Market</h3>
		<div className="">
			<GlobalOverView />
		</div>
	</div>
}