import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BarChart,
  Brain,
  CheckCircle2,
  Clock,
  Plus,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
type QuizStatus = 'ready' | 'completed' | 'generating' | 'in-progress';

type Quiz = {
	id: number;
	title: string;
	course: string;
	questions: number;
	duration: number;
	score: number | null;
	status: QuizStatus;
};

type Question = {
	id: number;
	question: string;
	options: string[];
	correctAnswer: number;
	explanation: string;
	topic: string;
};

type QuizAttempt = {
	answers: Record<number, number>;
	startTime: number;
	timeRemaining: number;
};

export function AutoQuizzesPage() {
	const [view, setView] = useState<'list' | 'quiz' | 'review'>('list');
	const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [quizAttempt, setQuizAttempt] = useState<QuizAttempt>({
		answers: {},
		startTime: Date.now(),
		timeRemaining: 1200, // 20 minutes in seconds
	});
	const [showGenerateDialog, setShowGenerateDialog] = useState(false);
	const [generateForm, setGenerateForm] = useState({
		course: '',
		topic: '',
		numQuestions: '10',
		difficulty: 'medium',
	});

	const [quizzes, setQuizzes] = useState<Quiz[]>([
		{
			id: 1,
			title: 'Data Structures Quiz',
			course: 'CS202',
			questions: 15,
			duration: 20,
			score: null,
			status: 'ready',
		},
		{
			id: 2,
			title: 'Calculus Practice',
			course: 'MATH201',
			questions: 10,
			duration: 15,
			score: 85,
			status: 'completed',
		},
		{
			id: 3,
			title: 'Physics Concepts',
			course: 'PHY102',
			questions: 12,
			duration: 18,
			score: 92,
			status: 'completed',
		},
		{
			id: 4,
			title: 'Algorithms Review',
			course: 'CS101',
			questions: 20,
			duration: 25,
			score: null,
			status: 'ready',
		},
	]);

	// Generate mock questions dynamically to support quizzes with varying lengths
	const generateMockQuestions = (count: number): Question[] => {
		const baseQuestions: Question[] = [
			{
				id: 1,
				question: 'What is the time complexity of binary search?',
				options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
				correctAnswer: 1,
				explanation:
					'Binary search divides the search space in half with each step, resulting in O(log n) time complexity.',
				topic: 'Algorithms',
			},
			{
				id: 2,
				question: 'Which data structure uses LIFO (Last In First Out)?',
				options: ['Queue', 'Stack', 'Array', 'Linked List'],
				correctAnswer: 1,
				explanation:
					'A Stack follows the Last In First Out principle, where the last element added is the first one to be removed.',
				topic: 'Data Structures',
			},
			{
				id: 3,
				question: 'What is the derivative of x²?',
				options: ['x', '2x', 'x³', '2x²'],
				correctAnswer: 1,
				explanation: 'Using the power rule, the derivative of x² is 2x.',
				topic: 'Calculus',
			},
			{
				id: 4,
				question:
					'Which sorting algorithm has the best average case performance?',
				options: [
					'Bubble Sort',
					'Selection Sort',
					'Merge Sort',
					'Insertion Sort',
				],
				correctAnswer: 2,
				explanation:
					'Merge Sort has O(n log n) average case complexity, which is optimal for comparison-based sorting.',
				topic: 'Algorithms',
			},
			{
				id: 5,
				question: 'What is a hash collision?',
				options: [
					'When two keys have the same value',
					'When two different keys hash to the same index',
					'When a hash table is full',
					'When a hash function returns null',
				],
				correctAnswer: 1,
				explanation:
					'A hash collision occurs when two different keys produce the same hash value, mapping to the same index in the hash table.',
				topic: 'Data Structures',
			},
			{
				id: 6,
				question: 'What is the limit of sin(x)/x as x approaches 0?',
				options: ['0', '1', '∞', 'Does not exist'],
				correctAnswer: 1,
				explanation:
					'This is a fundamental limit in calculus: lim(x→0) sin(x)/x = 1',
				topic: 'Calculus',
			},
			{
				id: 7,
				question: 'Which tree traversal visits the root node first?',
				options: ['In-order', 'Pre-order', 'Post-order', 'Level-order'],
				correctAnswer: 1,
				explanation:
					'Pre-order traversal visits the root node first, then the left subtree, then the right subtree.',
				topic: 'Data Structures',
			},
			{
				id: 8,
				question: 'What is dynamic programming?',
				options: [
					'Programming with dynamic typing',
					'Solving problems by breaking them into overlapping subproblems',
					'Real-time programming',
					'Object-oriented programming',
				],
				correctAnswer: 1,
				explanation:
					'Dynamic programming is an optimization technique that solves complex problems by breaking them down into simpler overlapping subproblems and storing their solutions.',
				topic: 'Algorithms',
			},
			{
				id: 9,
				question: 'What is the integral of 1/x?',
				options: ['x²/2', 'ln|x| + C', '1/x² + C', 'e^x + C'],
				correctAnswer: 1,
				explanation:
					'The integral of 1/x is the natural logarithm: ∫(1/x)dx = ln|x| + C',
				topic: 'Calculus',
			},
			{
				id: 10,
				question:
					'What is the space complexity of a recursive Fibonacci implementation?',
				options: ['O(1)', 'O(log n)', 'O(n)', 'O(2^n)'],
				correctAnswer: 2,
				explanation:
					'The space complexity is O(n) due to the call stack depth in the recursive implementation.',
				topic: 'Algorithms',
			},
			{
				id: 11,
				question: 'What is a binary tree?',
				options: [
					'A tree with exactly two nodes',
					'A tree where each node has at most two children',
					'A tree with two levels',
					'A tree with binary values',
				],
				correctAnswer: 1,
				explanation:
					'A binary tree is a tree data structure where each node has at most two children, referred to as left and right child.',
				topic: 'Data Structures',
			},
			{
				id: 12,
				question: "What is Newton's second law?",
				options: ['F = ma', 'E = mc²', 'F = G(m₁m₂)/r²', 'v = u + at'],
				correctAnswer: 0,
				explanation:
					"Newton's second law states that Force equals mass times acceleration (F = ma).",
				topic: 'Physics',
			},
			{
				id: 13,
				question: 'What is Big O notation used for?',
				options: [
					'Measuring actual runtime',
					'Describing algorithmic complexity',
					'Calculating memory usage',
					'Determining code quality',
				],
				correctAnswer: 1,
				explanation:
					"Big O notation is used to describe the upper bound of an algorithm's time or space complexity in the worst case.",
				topic: 'Algorithms',
			},
			{
				id: 14,
				question: 'What is the chain rule in calculus?',
				options: [
					'A rule for adding derivatives',
					'A rule for differentiating composite functions',
					'A rule for integration',
					'A rule for limits',
				],
				correctAnswer: 1,
				explanation:
					"The chain rule is used to differentiate composite functions: d/dx[f(g(x))] = f'(g(x)) · g'(x)",
				topic: 'Calculus',
			},
			{
				id: 15,
				question: 'What is a queue data structure?',
				options: [
					'LIFO structure',
					'FIFO structure',
					'Random access structure',
					'Hierarchical structure',
				],
				correctAnswer: 1,
				explanation:
					'A queue is a First In First Out (FIFO) data structure where elements are added at the rear and removed from the front.',
				topic: 'Data Structures',
			},
			{
				id: 16,
				question: 'What is recursion?',
				options: [
					'A loop structure',
					'A function calling itself',
					'A data structure',
					'An algorithm pattern',
				],
				correctAnswer: 1,
				explanation:
					'Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem.',
				topic: 'Algorithms',
			},
			{
				id: 17,
				question: 'What is the fundamental theorem of calculus?',
				options: [
					'Relates differentiation and integration',
					'Defines limits',
					'Explains derivatives',
					'Describes continuity',
				],
				correctAnswer: 0,
				explanation:
					'The fundamental theorem of calculus links the concept of differentiation and integration, showing they are inverse operations.',
				topic: 'Calculus',
			},
			{
				id: 18,
				question: 'What is a linked list?',
				options: [
					'An array with links',
					'A sequence of nodes with pointers',
					'A sorted list',
					'A circular array',
				],
				correctAnswer: 1,
				explanation:
					'A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node.',
				topic: 'Data Structures',
			},
			{
				id: 19,
				question: 'What is quicksort?',
				options: [
					'A search algorithm',
					'A divide-and-conquer sorting algorithm',
					'A greedy algorithm',
					'A graph algorithm',
				],
				correctAnswer: 1,
				explanation:
					'Quicksort is an efficient divide-and-conquer sorting algorithm that picks a pivot and partitions the array around it.',
				topic: 'Algorithms',
			},
			{
				id: 20,
				question: 'What is a partial derivative?',
				options: [
					'An incomplete derivative',
					'A derivative with respect to one variable in a multivariable function',
					'A derivative of a fraction',
					'A simplified derivative',
				],
				correctAnswer: 1,
				explanation:
					'A partial derivative is the derivative of a multivariable function with respect to one variable, treating others as constants.',
				topic: 'Calculus',
			},
			{
				id: 21,
				question: 'What is a graph in data structures?',
				options: [
					'A plotting chart',
					'A collection of nodes and edges',
					'A type of tree',
					'A linear structure',
				],
				correctAnswer: 1,
				explanation:
					'A graph is a non-linear data structure consisting of vertices (nodes) connected by edges.',
				topic: 'Data Structures',
			},
			{
				id: 22,
				question: "What is Dijkstra's algorithm used for?",
				options: [
					'Sorting arrays',
					'Finding shortest paths in a graph',
					'Searching trees',
					'Hashing data',
				],
				correctAnswer: 1,
				explanation:
					"Dijkstra's algorithm finds the shortest path between nodes in a weighted graph with non-negative edge weights.",
				topic: 'Algorithms',
			},
			{
				id: 23,
				question: 'What is the product rule in calculus?',
				options: [
					"d/dx[f·g] = f'·g + f·g'",
					"d/dx[f·g] = f'·g'",
					"d/dx[f·g] = f·g'",
					"d/dx[f·g] = f'+g'",
				],
				correctAnswer: 0,
				explanation:
					"The product rule states that the derivative of a product of two functions is: d/dx[f(x)·g(x)] = f'(x)·g(x) + f(x)·g'(x)",
				topic: 'Calculus',
			},
			{
				id: 24,
				question: 'What is a heap data structure?',
				options: [
					'A sorted array',
					'A complete binary tree with heap property',
					'A linked list',
					'A hash table',
				],
				correctAnswer: 1,
				explanation:
					"A heap is a complete binary tree where each parent node's value satisfies a specific relationship with its children (min-heap or max-heap).",
				topic: 'Data Structures',
			},
			{
				id: 25,
				question: 'What is the greedy algorithm approach?',
				options: [
					'Using maximum memory',
					'Making locally optimal choices at each step',
					'Trying all possibilities',
					'Using dynamic programming',
				],
				correctAnswer: 1,
				explanation:
					'A greedy algorithm makes the locally optimal choice at each step with the hope of finding a global optimum.',
				topic: 'Algorithms',
			},
		];

		// Return only the number of questions needed
		return baseQuestions.slice(0, Math.min(count, baseQuestions.length));
	};

	const mockQuestions = generateMockQuestions(activeQuiz?.questions || 25);

	const handleStartQuiz = (quiz: Quiz) => {
		setActiveQuiz(quiz);
		setCurrentQuestionIndex(0);
		setQuizAttempt({
			answers: {},
			startTime: Date.now(),
			timeRemaining: quiz.duration * 60,
		});
		setView('quiz');

		// Update quiz status
		setQuizzes(
			quizzes.map((q) =>
				q.id === quiz.id ? { ...q, status: 'in-progress' as QuizStatus } : q
			)
		);
	};

	const handleRetakeQuiz = (quiz: Quiz) => {
		handleStartQuiz({ ...quiz, score: null });
	};

	const handleAnswerSelect = (questionId: number, answerIndex: number) => {
		setQuizAttempt((prev) => ({
			...prev,
			answers: {
				...prev.answers,
				[questionId]: answerIndex,
			},
		}));
	};

	const handleSubmitQuiz = () => {
		if (!activeQuiz) return;

		// Calculate score
		let correct = 0;
		mockQuestions.slice(0, activeQuiz.questions).forEach((q) => {
			if (quizAttempt.answers[q.id] === q.correctAnswer) {
				correct++;
			}
		});

		const score = Math.round((correct / activeQuiz.questions) * 100);

		// Update quiz with score
		setQuizzes(
			quizzes.map((q) =>
				q.id === activeQuiz.id
					? { ...q, score, status: 'completed' as QuizStatus }
					: q
			)
		);

		setActiveQuiz({ ...activeQuiz, score, status: 'completed' });
		setView('review');
	};

	const handleReviewQuiz = (quiz: Quiz) => {
		setActiveQuiz(quiz);
		setCurrentQuestionIndex(0);
		setView('review');
	};

	const handleBackToList = () => {
		setView('list');
		setActiveQuiz(null);
		setCurrentQuestionIndex(0);
		setQuizAttempt({
			answers: {},
			startTime: Date.now(),
			timeRemaining: 1200,
		});
	};

	const handleGenerateQuiz = () => {
		const newQuiz: Quiz = {
			id: quizzes.length + 1,
			title: `${generateForm.topic || generateForm.course} Quiz`,
			course: generateForm.course,
			questions: parseInt(generateForm.numQuestions),
			duration: Math.ceil(parseInt(generateForm.numQuestions) * 1.5),
			score: null,
			status: 'generating',
		};

		setQuizzes([newQuiz, ...quizzes]);
		setShowGenerateDialog(false);

		// Simulate quiz generation
		setTimeout(() => {
			setQuizzes((prev) =>
				prev.map((q) =>
					q.id === newQuiz.id ? { ...q, status: 'ready' as QuizStatus } : q
				)
			);
		}, 3000);

		// Reset form
		setGenerateForm({
			course: '',
			topic: '',
			numQuestions: '10',
			difficulty: 'medium',
		});
	};

	// List View
	if (view === 'list') {
		return (
			<div className="p-6 max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
					<div>
						<h2 className="text-2xl mb-1">Auto Quizzes</h2>
						<p className="text-muted-foreground">
							AI-generated quizzes from your study materials
						</p>
					</div>

					<Button onClick={() => setShowGenerateDialog(true)}>
						<Sparkles className="w-4 h-4 mr-2" />
						Generate Quiz
					</Button>

					<Dialog
						open={showGenerateDialog}
						onOpenChange={setShowGenerateDialog}>
						<DialogContent className="sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Generate New Quiz</DialogTitle>
								<DialogDescription>
									Create an AI-generated quiz from your study materials
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-4">
								<div className="space-y-2">
									<Label htmlFor="course">Course</Label>
									<Select
										value={generateForm.course}
										onValueChange={(value) =>
											setGenerateForm({ ...generateForm, course: value })
										}>
										<SelectTrigger>
											<SelectValue placeholder="Select a course" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="CS101">
												CS101 - Introduction to Programming
											</SelectItem>
											<SelectItem value="CS202">
												CS202 - Data Structures
											</SelectItem>
											<SelectItem value="MATH201">
												MATH201 - Calculus I
											</SelectItem>
											<SelectItem value="PHY102">PHY102 - Physics</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="topic">Topic (Optional)</Label>
									<Input
										id="topic"
										placeholder="e.g., Arrays, Sorting Algorithms"
										value={generateForm.topic}
										onChange={(e) =>
											setGenerateForm({
												...generateForm,
												topic: e.target.value,
											})
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="questions">Number of Questions</Label>
									<Select
										value={generateForm.numQuestions}
										onValueChange={(value) =>
											setGenerateForm({ ...generateForm, numQuestions: value })
										}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="5">5 questions</SelectItem>
											<SelectItem value="10">10 questions</SelectItem>
											<SelectItem value="15">15 questions</SelectItem>
											<SelectItem value="20">20 questions</SelectItem>
											<SelectItem value="25">25 questions</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="difficulty">Difficulty</Label>
									<Select
										value={generateForm.difficulty}
										onValueChange={(value) =>
											setGenerateForm({ ...generateForm, difficulty: value })
										}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="easy">Easy</SelectItem>
											<SelectItem value="medium">Medium</SelectItem>
											<SelectItem value="hard">Hard</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<Button
								onClick={handleGenerateQuiz}
								disabled={!generateForm.course}
								className="w-full">
								<Sparkles className="w-4 h-4 mr-2" />
								Generate Quiz
							</Button>
						</DialogContent>
					</Dialog>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total Quizzes</p>
								<p className="text-2xl mt-1">{quizzes.length}</p>
							</div>
							<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
								<Brain className="w-6 h-6 text-primary" />
							</div>
						</div>
					</Card>
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Average Score</p>
								<p className="text-2xl mt-1">
									{Math.round(
										quizzes
											.filter((q) => q.score !== null)
											.reduce((acc, q) => acc + (q.score || 0), 0) /
											quizzes.filter((q) => q.score !== null).length
									) || 0}
									%
								</p>
							</div>
							<div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
								<Trophy className="w-6 h-6 text-green-600" />
							</div>
						</div>
					</Card>
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Completed</p>
								<p className="text-2xl mt-1">
									{quizzes.filter((q) => q.status === 'completed').length}
								</p>
							</div>
							<div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
								<CheckCircle2 className="w-6 h-6 text-blue-600" />
							</div>
						</div>
					</Card>
				</div>

				{/* Quizzes Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{quizzes.map((quiz) => (
						<Card
							key={quiz.id}
							className="p-6 hover:shadow-md transition-shadow">
							<div className="flex items-start justify-between mb-4">
								<div>
									<h3 className="mb-2">{quiz.title}</h3>
									<Badge variant="secondary">{quiz.course}</Badge>
								</div>
								{quiz.status === 'generating' && (
									<Badge className="bg-orange-500">
										<Sparkles className="w-3 h-3 mr-1" />
										Generating
									</Badge>
								)}
								{quiz.status === 'completed' && quiz.score !== null && (
									<Badge
										className={
											quiz.score >= 70 ? 'bg-green-500' : 'bg-orange-500'
										}>
										{quiz.score}%
									</Badge>
								)}
								{quiz.status === 'in-progress' && (
									<Badge className="bg-blue-500">In Progress</Badge>
								)}
							</div>

							<div className="space-y-2 mb-4">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Questions</span>
									<span>{quiz.questions}</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Duration</span>
									<span>{quiz.duration} min</span>
								</div>
							</div>

							{quiz.status === 'ready' && (
								<Button
									className="w-full"
									onClick={() => handleStartQuiz(quiz)}>
									Start Quiz
								</Button>
							)}
							{quiz.status === 'completed' && (
								<div className="flex gap-2">
									<Button
										variant="outline"
										className="flex-1"
										onClick={() => handleReviewQuiz(quiz)}>
										Review
									</Button>
									<Button
										className="flex-1"
										onClick={() => handleRetakeQuiz(quiz)}>
										Retake
									</Button>
								</div>
							)}
							{quiz.status === 'generating' && (
								<Button className="w-full" disabled>
									<Sparkles className="w-4 h-4 mr-2 animate-pulse" />
									Generating...
								</Button>
							)}
						</Card>
					))}
				</div>
			</div>
		);
	}

	// Quiz Taking View
	if (view === 'quiz' && activeQuiz) {
		const currentQuestion = mockQuestions[currentQuestionIndex];
		const progress = ((currentQuestionIndex + 1) / activeQuiz.questions) * 100;
		const answeredCount = Object.keys(quizAttempt.answers).length;

		return (
			<div className="p-6 max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-6">
					<Button variant="ghost" onClick={handleBackToList} className="mb-4">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Quizzes
					</Button>

					<div className="flex items-start justify-between mb-4">
						<div>
							<h2 className="text-2xl mb-1">{activeQuiz.title}</h2>
							<p className="text-muted-foreground">
								Question {currentQuestionIndex + 1} of {activeQuiz.questions}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-5 h-5 text-muted-foreground" />
							<span className="text-lg">
								{Math.floor(quizAttempt.timeRemaining / 60)}:
								{String(quizAttempt.timeRemaining % 60).padStart(2, '0')}
							</span>
						</div>
					</div>

					<Progress value={progress} className="h-2" />
				</div>

				{/* Question Card */}
				<Card className="p-8 mb-6">
					<div className="mb-2">
						<Badge variant="outline">{currentQuestion.topic}</Badge>
					</div>

					<h3 className="text-xl mb-6">{currentQuestion.question}</h3>

					<RadioGroup
						value={quizAttempt.answers[currentQuestion.id]?.toString()}
						onValueChange={(value) =>
							handleAnswerSelect(currentQuestion.id, parseInt(value))
						}>
						<div className="space-y-3">
							{currentQuestion.options.map((option, index) => (
								<div
									key={index}
									className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
									<RadioGroupItem
										value={index.toString()}
										id={`option-${index}`}
									/>
									<Label
										htmlFor={`option-${index}`}
										className="flex-1 cursor-pointer">
										{option}
									</Label>
								</div>
							))}
						</div>
					</RadioGroup>
				</Card>

				{/* Navigation */}
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						{answeredCount} of {activeQuiz.questions} answered
					</div>

					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() =>
								setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
							}
							disabled={currentQuestionIndex === 0}>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Previous
						</Button>

						{currentQuestionIndex < activeQuiz.questions - 1 ? (
							<Button
								onClick={() =>
									setCurrentQuestionIndex(currentQuestionIndex + 1)
								}>
								Next
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						) : (
							<Button
								onClick={handleSubmitQuiz}
								className="bg-green-600 hover:bg-green-700">
								<CheckCircle2 className="w-4 h-4 mr-2" />
								Submit Quiz
							</Button>
						)}
					</div>
				</div>

				{/* Question Navigation Grid */}
				<Card className="p-6 mt-6">
					<h4 className="mb-4">Question Navigator</h4>
					<div className="grid grid-cols-10 gap-2">
						{Array.from({ length: activeQuiz.questions }).map((_, index) => {
							const question = mockQuestions[index];
							return (
								<Button
									key={index}
									variant={
										currentQuestionIndex === index ? 'default' : 'outline'
									}
									size="sm"
									className={`h-10 ${
										question && quizAttempt.answers[question.id] !== undefined
											? 'border-green-500 bg-green-500/10'
											: ''
									}`}
									onClick={() => setCurrentQuestionIndex(index)}>
									{index + 1}
								</Button>
							);
						})}
					</div>
				</Card>
			</div>
		);
	}

	// Review View
	if (view === 'review' && activeQuiz) {
		const currentQuestion = mockQuestions[currentQuestionIndex];
		const userAnswer = quizAttempt.answers[currentQuestion.id];
		const isCorrect = userAnswer === currentQuestion.correctAnswer;

		const totalCorrect = mockQuestions
			.slice(0, activeQuiz.questions)
			.filter((q) => quizAttempt.answers[q.id] === q.correctAnswer).length;

		return (
			<div className="p-6 max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-6">
					<Button variant="ghost" onClick={handleBackToList} className="mb-4">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Quizzes
					</Button>

					<div className="flex items-start justify-between mb-6">
						<div>
							<h2 className="text-2xl mb-1">{activeQuiz.title} - Review</h2>
							<p className="text-muted-foreground">
								Question {currentQuestionIndex + 1} of {activeQuiz.questions}
							</p>
						</div>
					</div>
				</div>

				{/* Score Summary */}
				<Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-primary/10">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-muted-foreground mb-2">Your Score</p>
							<p className="text-4xl mb-2">{activeQuiz.score}%</p>
							<p className="text-muted-foreground">
								{totalCorrect} correct out of {activeQuiz.questions}
							</p>
						</div>
						<div className="flex items-center gap-4">
							<div className="text-center">
								<div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
									<CheckCircle2 className="w-8 h-8 text-green-600" />
								</div>
								<p className="text-sm">{totalCorrect} Correct</p>
							</div>
							<div className="text-center">
								<div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
									<XCircle className="w-8 h-8 text-red-600" />
								</div>
								<p className="text-sm">
									{activeQuiz.questions - totalCorrect} Wrong
								</p>
							</div>
						</div>
					</div>

					<Separator className="my-4" />

					<div className="flex gap-2">
						<Button
							onClick={() => handleRetakeQuiz(activeQuiz)}
							className="flex-1">
							<RotateCcw className="w-4 h-4 mr-2" />
							Retake Quiz
						</Button>
						<Button
							variant="outline"
							onClick={handleBackToList}
							className="flex-1">
							Back to Quizzes
						</Button>
					</div>
				</Card>

				{/* Question Review Card */}
				<Card
					className={`p-8 mb-6 border-2 ${
						isCorrect
							? 'border-green-500 bg-green-500/5'
							: 'border-red-500 bg-red-500/5'
					}`}>
					<div className="flex items-start gap-3 mb-4">
						{isCorrect ? (
							<CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
						) : (
							<XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
						)}
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<Badge variant="outline">{currentQuestion.topic}</Badge>
								<Badge className={isCorrect ? 'bg-green-500' : 'bg-red-500'}>
									{isCorrect ? 'Correct' : 'Incorrect'}
								</Badge>
							</div>
							<h3 className="text-xl">{currentQuestion.question}</h3>
						</div>
					</div>

					<div className="space-y-3 mb-6">
						{currentQuestion.options.map((option, index) => {
							const isUserAnswer = userAnswer === index;
							const isCorrectAnswer = currentQuestion.correctAnswer === index;

							return (
								<div
									key={index}
									className={`p-4 rounded-lg border-2 ${
										isCorrectAnswer
											? 'border-green-500 bg-green-500/10'
											: isUserAnswer
												? 'border-red-500 bg-red-500/10'
												: 'border-border bg-background'
									}`}>
									<div className="flex items-center gap-3">
										{isCorrectAnswer && (
											<CheckCircle2 className="w-5 h-5 text-green-600" />
										)}
										{isUserAnswer && !isCorrectAnswer && (
											<XCircle className="w-5 h-5 text-red-600" />
										)}
										<span
											className={
												isCorrectAnswer || isUserAnswer ? 'font-medium' : ''
											}>
											{option}
										</span>
									</div>
								</div>
							);
						})}
					</div>

					<div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
						<div className="flex items-start gap-2">
							<AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
							<div>
								<p className="text-sm mb-1">Explanation:</p>
								<p className="text-sm text-muted-foreground">
									{currentQuestion.explanation}
								</p>
							</div>
						</div>
					</div>
				</Card>

				{/* Navigation */}
				<div className="flex items-center justify-between mb-6">
					<Button
						variant="outline"
						onClick={() =>
							setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
						}
						disabled={currentQuestionIndex === 0}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Previous Question
					</Button>

					<Button
						variant="outline"
						onClick={() =>
							setCurrentQuestionIndex(
								Math.min(activeQuiz.questions - 1, currentQuestionIndex + 1)
							)
						}
						disabled={currentQuestionIndex === activeQuiz.questions - 1}>
						Next Question
						<ArrowRight className="w-4 h-4 ml-2" />
					</Button>
				</div>

				{/* Question Navigation Grid */}
				<Card className="p-6">
					<h4 className="mb-4">Question Overview</h4>
					<div className="grid grid-cols-10 gap-2">
						{Array.from({ length: activeQuiz.questions }).map((_, index) => {
							const question = mockQuestions[index];
							if (!question) return null;

							const answer = quizAttempt.answers[question.id];
							const correct = answer === question.correctAnswer;

							return (
								<Button
									key={index}
									variant={
										currentQuestionIndex === index ? 'default' : 'outline'
									}
									size="sm"
									className={`h-10 ${
										correct
											? 'border-green-500 bg-green-500/20 hover:bg-green-500/30'
											: 'border-red-500 bg-red-500/20 hover:bg-red-500/30'
									}`}
									onClick={() => setCurrentQuestionIndex(index)}>
									{index + 1}
								</Button>
							);
						})}
					</div>
				</Card>
			</div>
		);
	}

	return null;
}
