import * as d3 from 'd3';
import {
  BookOpen,
  Link2,
  Maximize2,
  Minimize2,
  Network,
  Pause,
  Play,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Slider } from '../ui/slider';
type Note = {
	id: string;
	title: string;
	courseCode: string;
	tags: string[];
};

type Connection = {
	source: string;
	target: string;
	sharedTags: string[];
	strength: number;
};

type D3Node = Note & d3.SimulationNodeDatum;

type D3Link = {
	source: string | D3Node;
	target: string | D3Node;
	sharedTags: string[];
	strength: number;
};

export function KnowledgeWebPage() {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [filterTag, setFilterTag] = useState<string>('all');
	const [zoom, setZoom] = useState(1);
	const [isSimulating, setIsSimulating] = useState(true);
	const [repulsionStrength, setRepulsionStrength] = useState(-500);
	const [attractionStrength, setAttractionStrength] = useState(0.3);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Mocked notes data
	const notes: Note[] = [
		{
			id: '1',
			title: 'Introduction to Algorithms',
			courseCode: 'CS101',
			tags: ['Algorithms', 'Theory', 'Basics'],
		},
		{
			id: '2',
			title: 'Sorting Algorithms',
			courseCode: 'CS101',
			tags: ['Algorithms', 'Practice', 'Sorting'],
		},
		{
			id: '3',
			title: 'Binary Trees',
			courseCode: 'CS202',
			tags: ['Data Structures', 'Trees', 'Algorithms'],
		},
		{
			id: '4',
			title: 'Graph Theory',
			courseCode: 'CS202',
			tags: ['Data Structures', 'Graphs', 'Theory'],
		},
		{
			id: '5',
			title: 'Calculus Basics',
			courseCode: 'MATH201',
			tags: ['Mathematics', 'Calculus', 'Theory'],
		},
		{
			id: '6',
			title: 'Derivatives',
			courseCode: 'MATH201',
			tags: ['Mathematics', 'Calculus', 'Practice'],
		},
		{
			id: '7',
			title: "Newton's Laws",
			courseCode: 'PHY102',
			tags: ['Physics', 'Mechanics', 'Theory'],
		},
		{
			id: '8',
			title: 'Dynamic Programming',
			courseCode: 'CS101',
			tags: ['Algorithms', 'Optimization', 'Practice'],
		},
		{
			id: '9',
			title: 'Hash Tables',
			courseCode: 'CS202',
			tags: ['Data Structures', 'Hashing', 'Practice'],
		},
		{
			id: '10',
			title: 'Big O Notation',
			courseCode: 'CS101',
			tags: ['Algorithms', 'Theory', 'Complexity'],
		},
	];

	// Calculate connections based on shared tags
	const connections: Connection[] = [];
	for (let i = 0; i < notes.length; i++) {
		for (let j = i + 1; j < notes.length; j++) {
			const sharedTags = notes[i].tags.filter((tag) =>
				notes[j].tags.includes(tag)
			);
			if (sharedTags.length > 0) {
				connections.push({
					source: notes[i].id,
					target: notes[j].id,
					sharedTags,
					strength: sharedTags.length,
				});
			}
		}
	}

	// Get all unique tags
	const allTags = Array.from(
		new Set(notes.flatMap((note) => note.tags))
	).sort();

	// Filter notes and connections based on selected tag
	const filteredNotes =
		filterTag === 'all'
			? notes
			: notes.filter((note) => note.tags.includes(filterTag));

	const filteredConnections = connections.filter((conn) => {
		const fromNote = notes.find((n) => n.id === conn.source);
		const toNote = notes.find((n) => n.id === conn.target);
		return filteredNotes.includes(fromNote!) && filteredNotes.includes(toNote!);
	});

	// Get course color
	const getCourseColor = (courseCode: string) => {
		const colors: Record<string, string> = {
			CS101: '#3b82f6',
			CS202: '#22c55e',
			MATH201: '#a855f7',
			PHY102: '#f97316',
		};
		return colors[courseCode] || '#6b7280';
	};

	// D3 visualization
	useEffect(() => {
		if (!svgRef.current || filteredNotes.length === 0) return;

		const width = isFullscreen ? 1200 : 800;
		const height = isFullscreen ? 800 : 600;

		// Clear previous content
		d3.select(svgRef.current).selectAll('*').remove();

		const svg = d3
			.select(svgRef.current)
			.attr('viewBox', `0 0 ${width} ${height}`)
			.attr('width', '100%')
			.attr('height', '100%');

		// Create container for zoom/pan
		const g = svg.append('g');

		// Setup zoom behavior
		const zoomBehavior = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.3, 3])
			.on('zoom', (event) => {
				g.attr('transform', event.transform);
				setZoom(event.transform.k);
			});

		svg.call(zoomBehavior);

		// Create D3 data structures
		const d3Nodes: D3Node[] = filteredNotes.map((note) => ({ ...note }));
		const d3Links: D3Link[] = filteredConnections.map((conn) => ({
			source: conn.source,
			target: conn.target,
			sharedTags: conn.sharedTags,
			strength: conn.strength,
		}));

		// Create force simulation
		const simulation = d3
			.forceSimulation<D3Node>(d3Nodes)
			.force(
				'link',
				d3
					.forceLink<D3Node, D3Link>(d3Links)
					.id((d) => d.id)
					.distance(100)
					.strength((d) => attractionStrength * d.strength)
			)
			.force('charge', d3.forceManyBody().strength(repulsionStrength))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force('collision', d3.forceCollide().radius(30));

		// Create links
		const link = g
			.append('g')
			.selectAll('line')
			.data(d3Links)
			.join('line')
			.attr('stroke', '#9ca3af')
			.attr('stroke-opacity', 0.5)
			.attr('stroke-width', (d) => 1 + d.strength * 0.5);

		// Create node groups
		const node = g
			.append('g')
			.selectAll<SVGGElement, D3Node>('g')
			.data(d3Nodes)
			.join('g')
			.call(
				d3
					.drag<SVGGElement, D3Node>()
					.on('start', (event, d) => {
						if (!event.active && isSimulating)
							simulation.alphaTarget(0.3).restart();
						d.fx = d.x;
						d.fy = d.y;
					})
					.on('drag', (event, d) => {
						d.fx = event.x;
						d.fy = event.y;
					})
					.on('end', (event, d) => {
						if (!event.active && isSimulating) simulation.alphaTarget(0);
						d.fx = null;
						d.fy = null;
					})
			);

		// Add circles to nodes
		node
			.append('circle')
			.attr('r', (d) => {
				const connectionCount = d3Links.filter(
					(l) =>
						(typeof l.source === 'object' ? l.source.id : l.source) === d.id ||
						(typeof l.target === 'object' ? l.target.id : l.target) === d.id
				).length;
				return 8 + Math.sqrt(connectionCount) * 2;
			})
			.attr('fill', (d) => getCourseColor(d.courseCode))
			.attr('stroke', '#fff')
			.attr('stroke-width', 2)
			.style('cursor', 'pointer');

		// Add connection count badges
		node
			.append('circle')
			.attr('r', (d) => {
				const connectionCount = d3Links.filter(
					(l) =>
						(typeof l.source === 'object' ? l.source.id : l.source) === d.id ||
						(typeof l.target === 'object' ? l.target.id : l.target) === d.id
				).length;
				const radius = 8 + Math.sqrt(connectionCount) * 2;
				return radius * 0.6;
			})
			.attr('fill', 'rgba(255, 255, 255, 0.95)');

		node
			.append('text')
			.text((d) => {
				const connectionCount = d3Links.filter(
					(l) =>
						(typeof l.source === 'object' ? l.source.id : l.source) === d.id ||
						(typeof l.target === 'object' ? l.target.id : l.target) === d.id
				).length;
				return connectionCount.toString();
			})
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle')
			.attr('font-size', '11px')
			.attr('font-weight', 'bold')
			.attr('fill', (d) => getCourseColor(d.courseCode))
			.style('pointer-events', 'none');

		// Add labels (hidden by default, shown on hover)
		const label = node
			.append('g')
			.attr('class', 'label-group')
			.style('opacity', 0);

		label
			.append('rect')
			.attr('x', (d) => {
				const text =
					d.title.length > 20 ? d.title.slice(0, 20) + '...' : d.title;
				return -text.length * 3.5;
			})
			.attr('y', -35)
			.attr('width', (d) => {
				const text =
					d.title.length > 20 ? d.title.slice(0, 20) + '...' : d.title;
				return text.length * 7;
			})
			.attr('height', 24)
			.attr('fill', 'rgba(0, 0, 0, 0.9)')
			.attr('rx', 4);

		label
			.append('text')
			.text((d) =>
				d.title.length > 20 ? d.title.slice(0, 20) + '...' : d.title
			)
			.attr('y', -22)
			.attr('text-anchor', 'middle')
			.attr('font-size', '13px')
			.attr('font-weight', 'bold')
			.attr('fill', '#ffffff')
			.style('pointer-events', 'none');

		// Add hover effects
		node
			.on('mouseenter', function (event, d) {
				d3.select(this)
					.select('.label-group')
					.transition()
					.duration(200)
					.style('opacity', 1);

				// Highlight connected links
				link
					.attr('stroke', (l) => {
						const sourceId =
							typeof l.source === 'object' ? l.source.id : l.source;
						const targetId =
							typeof l.target === 'object' ? l.target.id : l.target;
						return sourceId === d.id || targetId === d.id
							? '#3b82f6'
							: '#9ca3af';
					})
					.attr('stroke-opacity', (l) => {
						const sourceId =
							typeof l.source === 'object' ? l.source.id : l.source;
						const targetId =
							typeof l.target === 'object' ? l.target.id : l.target;
						return sourceId === d.id || targetId === d.id ? 0.9 : 0.5;
					})
					.attr('stroke-width', (l) => {
						const sourceId =
							typeof l.source === 'object' ? l.source.id : l.source;
						const targetId =
							typeof l.target === 'object' ? l.target.id : l.target;
						return sourceId === d.id || targetId === d.id
							? 2 + l.strength
							: 1 + l.strength * 0.5;
					});
			})
			.on('mouseleave', function () {
				d3.select(this)
					.select('.label-group')
					.transition()
					.duration(200)
					.style('opacity', 0);

				// Reset link styles
				link
					.attr('stroke', '#9ca3af')
					.attr('stroke-opacity', 0.5)
					.attr('stroke-width', (d) => 1 + d.strength * 0.5);
			})
			.on('click', (event, d) => {
				setSelectedNote(d);
			});

		// Update positions on simulation tick
		simulation.on('tick', () => {
			link
				.attr('x1', (d) => (d.source as D3Node).x!)
				.attr('y1', (d) => (d.source as D3Node).y!)
				.attr('x2', (d) => (d.target as D3Node).x!)
				.attr('y2', (d) => (d.target as D3Node).y!);

			node.attr('transform', (d) => `translate(${d.x},${d.y})`);
		});

		// Stop/start simulation based on isSimulating
		if (!isSimulating) {
			simulation.stop();
		}

		return () => {
			simulation.stop();
		};
	}, [
		filteredNotes,
		filteredConnections,
		isSimulating,
		repulsionStrength,
		attractionStrength,
		isFullscreen,
	]);

	// Get connections for selected note
	const selectedNoteConnections = selectedNote
		? connections.filter(
				(c) => c.source === selectedNote.id || c.target === selectedNote.id
			)
		: [];

	const handleZoomIn = () => {
		if (!svgRef.current) return;
		const svg = d3.select(svgRef.current);
		svg
			.transition()
			.call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);
	};

	const handleZoomOut = () => {
		if (!svgRef.current) return;
		const svg = d3.select(svgRef.current);
		svg
			.transition()
			.call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.7);
	};

	const handleReset = () => {
		if (!svgRef.current) return;
		const svg = d3.select(svgRef.current);
		svg
			.transition()
			.call(
				d3.zoom<SVGSVGElement, unknown>().transform as any,
				d3.zoomIdentity
			);
	};

	return (
		<div
			className={`${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'p-6 max-w-7xl mx-auto'}`}>
			{/* Header */}
			<div
				className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 ${isFullscreen ? 'p-6 pb-0' : ''}`}>
				<div>
					<h2 className="text-2xl mb-1">Knowledge Web</h2>
					<p className="text-muted-foreground">
						Interactive graph view of note connections based on shared tags
						(powered by d3.js)
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Select value={filterTag} onValueChange={setFilterTag}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="Filter by tag" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Tags</SelectItem>
							{allTags.map((tag) => (
								<SelectItem key={tag} value={tag}>
									{tag}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						size="sm"
						variant="outline"
						onClick={() => setIsFullscreen(!isFullscreen)}>
						{isFullscreen ? (
							<Minimize2 className="w-4 h-4" />
						) : (
							<Maximize2 className="w-4 h-4" />
						)}
					</Button>
				</div>
			</div>

			{/* Stats */}
			<div
				className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${isFullscreen ? 'px-6' : ''}`}>
				<Card className="p-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
							<BookOpen className="w-5 h-5 text-blue-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Total Notes</p>
							<p className="text-xl">{notes.length}</p>
						</div>
					</div>
				</Card>
				<Card className="p-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
							<Link2 className="w-5 h-5 text-green-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Connections</p>
							<p className="text-xl">{connections.length}</p>
						</div>
					</div>
				</Card>
				<Card className="p-4">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
							<Network className="w-5 h-5 text-purple-600" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Unique Tags</p>
							<p className="text-xl">{allTags.length}</p>
						</div>
					</div>
				</Card>
			</div>

			<div
				className={`grid grid-cols-1 ${isFullscreen ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 ${isFullscreen ? 'px-6 pb-6 h-[calc(100vh-280px)]' : ''}`}>
				{/* SVG Canvas */}
				<div
					className={`${isFullscreen ? 'lg:col-span-3' : 'lg:col-span-2'} ${isFullscreen ? 'h-full' : ''}`}>
					<Card className={`p-6 ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
						<div className="flex items-center justify-between mb-4">
							<h3>Graph View</h3>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant={isSimulating ? 'default' : 'outline'}
									onClick={() => setIsSimulating(!isSimulating)}>
									{isSimulating ? (
										<Pause className="w-4 h-4" />
									) : (
										<Play className="w-4 h-4" />
									)}
								</Button>
								<Button size="sm" variant="outline" onClick={handleZoomOut}>
									<ZoomOut className="w-4 h-4" />
								</Button>
								<Button size="sm" variant="outline" onClick={handleZoomIn}>
									<ZoomIn className="w-4 h-4" />
								</Button>
								<Button size="sm" variant="outline" onClick={handleReset}>
									Reset
								</Button>
							</div>
						</div>

						<div
							ref={containerRef}
							className={`relative bg-white border border-border rounded-lg overflow-hidden shadow-sm ${isFullscreen ? 'flex-1' : ''}`}>
							<svg
								ref={svgRef}
								className="w-full h-full"
								style={{
									backgroundColor: '#ffffff',
									minHeight: isFullscreen ? '100%' : '600px',
								}}
							/>

							{/* Controls overlay */}
							<div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg border border-border space-y-3">
								<div>
									<p className="text-xs mb-2 text-muted-foreground flex items-center gap-2">
										<Network className="w-3 h-3" />
										Repulsion
									</p>
									<Slider
										value={[Math.abs(repulsionStrength)]}
										onValueChange={(v) => setRepulsionStrength(-v[0])}
										min={100}
										max={1000}
										step={50}
										className="w-32"
									/>
								</div>
								<div>
									<p className="text-xs mb-2 text-muted-foreground flex items-center gap-2">
										<Link2 className="w-3 h-3" />
										Attraction
									</p>
									<Slider
										value={[attractionStrength * 100]}
										onValueChange={(v) => setAttractionStrength(v[0] / 100)}
										min={10}
										max={100}
										step={5}
										className="w-32"
									/>
								</div>
								<div className="pt-2 border-t border-border">
									<p className="text-xs text-muted-foreground">
										Zoom: {zoom.toFixed(1)}x
									</p>
								</div>
							</div>

							{/* Instructions */}
							<div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg border border-border">
								<p className="text-xs text-muted-foreground">
									• Drag nodes to reposition • Scroll/pinch to zoom • Click &
									drag to pan
								</p>
							</div>
						</div>

						<p className="text-sm text-muted-foreground mt-4 text-center">
							Node size represents connection count • Hover to see details •
							Click to select
						</p>
					</Card>
				</div>

				{/* Details Panel */}
				<div className={`space-y-4 ${isFullscreen ? 'overflow-y-auto' : ''}`}>
					{selectedNote ? (
						<>
							<Card className="p-4">
								<div className="flex items-start justify-between mb-3">
									<h3 className="text-lg">Note Details</h3>
									<Badge variant="secondary">{selectedNote.courseCode}</Badge>
								</div>
								<p className="mb-4">{selectedNote.title}</p>
								<div>
									<p className="text-sm text-muted-foreground mb-2">Tags:</p>
									<div className="flex flex-wrap gap-2">
										{selectedNote.tags.map((tag) => (
											<Badge key={tag} variant="outline">
												{tag}
											</Badge>
										))}
									</div>
								</div>
							</Card>

							<Card className="p-4">
								<h4 className="mb-3">
									Connected Notes ({selectedNoteConnections.length})
								</h4>
								<div className="space-y-2 max-h-96 overflow-y-auto">
									{selectedNoteConnections.map((conn) => {
										const connectedId =
											conn.source === selectedNote.id
												? conn.target
												: conn.source;
										const connectedNote = notes.find(
											(n) => n.id === connectedId
										);

										return connectedNote ? (
											<div
												key={connectedId}
												className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
												onClick={() => setSelectedNote(connectedNote)}>
												<div className="flex items-start justify-between mb-2">
													<p className="text-sm flex-1">
														{connectedNote.title}
													</p>
													<Badge variant="secondary" className="text-xs">
														{connectedNote.courseCode}
													</Badge>
												</div>
												<div className="flex items-center gap-1">
													<p className="text-xs text-muted-foreground">
														{conn.sharedTags.length} shared tag
														{conn.sharedTags.length > 1 ? 's' : ''}:
													</p>
													{conn.sharedTags.slice(0, 2).map((tag) => (
														<Badge
															key={tag}
															variant="outline"
															className="text-xs">
															{tag}
														</Badge>
													))}
													{conn.sharedTags.length > 2 && (
														<Badge variant="outline" className="text-xs">
															+{conn.sharedTags.length - 2}
														</Badge>
													)}
												</div>
											</div>
										) : null;
									})}
								</div>
							</Card>
						</>
					) : (
						<Card className="p-8 text-center">
							<Network className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
							<p className="text-muted-foreground mb-2">
								Click on a node to view details
							</p>
							<p className="text-sm text-muted-foreground">
								{filteredNotes.length} notes • {filteredConnections.length}{' '}
								connections
							</p>
						</Card>
					)}

					{/* Top Tags */}
					<Card className="p-4">
						<h4 className="mb-3">Most Common Tags</h4>
						<div className="space-y-2">
							{allTags.slice(0, 8).map((tag) => {
								const count = notes.filter((note) =>
									note.tags.includes(tag)
								).length;
								return (
									<div key={tag} className="flex items-center justify-between">
										<Badge
											variant="outline"
											className="cursor-pointer hover:bg-accent transition-colors"
											onClick={() => setFilterTag(tag)}>
											{tag}
										</Badge>
										<span className="text-sm text-muted-foreground">
											{count}
										</span>
									</div>
								);
							})}
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
