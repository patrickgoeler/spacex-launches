import { formatDistanceToNow } from "date-fns"
import Head from "next/head"
import LaunchCard from "../components/LaunchCard"
import { getLayout } from "../components/Layout/Base"
import { addApolloState, initializeApollo } from "../lib/ApolloClient"
import { UpcomingLaunchesDocument, useUpcomingLaunchesQuery } from "../lib/generated/graphql"

export default function Index() {
	const { loading, error, data } = useUpcomingLaunchesQuery()

	if (error) return <div>Error Loading Posts...</div>
	if (loading) return <div>Loading</div>

	const nextLaunchIn = formatDistanceToNow(new Date(data?.upcomingLaunches[0].dateUtc!), {
		includeSeconds: true,
	})

	return (
		<>
			<Head>
				<title>LaunchX | Upcoming Launches</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta property="og:title" content="LaunchX | Upcoming Launches" key="title" />
				<meta property="og:description" content="" key="ogdesc" />
				<meta property="og:url" content="currenturl" key="ogurl" />
				<meta property="og:image" content="preview image" key="ogimage" />
				<meta property="og:site_name" content="sitename" key="ogsitename" />
				<meta name="description" content="" />
				<meta name="twitter:card" content="summary" key="twcard" />
				<meta name="twitter:creator" content="" key="twhandle" />
			</Head>
			{/* Hero Card */}
			<h1 className="font-extrabold mb-10 mt-4 sm:mt-10 text-4xl sm:text-6xl lg:text-7xl tracking-tight">
				Next Launch in {nextLaunchIn}
			</h1>
			<LaunchCard variant="wide" index={0} />
			<h1 className="font-extrabold mb-10 mt-20 text-2xl sm:text-4xl lg:text-5xl tracking-tight">
				Upcoming SpaceX Launches
			</h1>
			{/* Launch Grid  */}
			<div className="grid gap-2 lg:grid-cols-3 md:grid-cols-2">
				{data?.upcomingLaunches.slice(1).map((_, i) => (
					<LaunchCard key={i} variant="compact" index={i + 1} />
				))}
			</div>
		</>
	)
}

;(Index as any).getLayout = getLayout

export async function getStaticProps() {
	const apolloClient = initializeApollo()

	await apolloClient.query({
		query: UpcomingLaunchesDocument,
	})

	return addApolloState(apolloClient, {
		props: {},
		revalidate: 1,
	})
}
