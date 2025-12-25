// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, Book, Target, TrendingUp, LogIn, LogOut, 
  ArrowLeft, ExternalLink, X, Flame 
} from 'lucide-react';
import { auth, db, registerWithEmail, loginWithEmail, logout } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// --- DATA SECTION ---
const PROBLEM_DATA = {
  1: [
    { id: 'p1', title: "Range Sum Query - Immutable", difficulty: "Easy", link: "https://leetcode.com/problems/range-sum-query-immutable/", desc: "Calculate sum of elements between indices left and right." },
    { id: 'p2', title: "Contiguous Array", difficulty: "Medium", link: "https://leetcode.com/problems/contiguous-array/", desc: "Find max length of contiguous subarray with equal 0s and 1s." },
    { id: 'p3', title: "Subarray Sum Equals K", difficulty: "Medium", link: "https://leetcode.com/problems/subarray-sum-equals-k/", desc: "Total number of subarrays whose sum equals to k." },
    { id: 'p4', title: "Product of Array Except Self", difficulty: "Medium", link: "https://leetcode.com/problems/product-of-array-except-self/", desc: "Return an array output such that output[i] is equal to the product of all the elements of nums except nums[i]." }
  ],
  2: [
    { id: 'tp1', title: "Two Sum II - Input Array Is Sorted", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", desc: "Find two numbers in a sorted array that sum to a target value." },
    { id: 'tp2', title: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/", desc: "Find all unique triplets that sum to zero." },
    { id: 'tp3', title: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/", desc: "Find two lines that form a container with most water." },
  ],
  
  3: [
    { id: 'tp1', title: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", desc: "Find length of longest substring without repeating characters." },
    { id: 'tp2', title: "Minimum Window Substring", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/", desc: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window." },
    { id: 'tp3', title: "Sliding Window Maximum", difficulty: "Hard", link: "https://leetcode.com/problems/sliding-window-maximum/", desc: "Find maximum values in each sliding window." },
    { id: 'tp4', title: "Longest Repeating Character Replacement", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/", desc: "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times." },
  ],
  4: [
    { id: 'tp1', title: "Linked List Cycle", difficulty: "Easy", link: "https://leetcode.com/problems/linked-list-cycle/", desc: "Check if a linked list has a cycle." },
    { id: 'tp2', title: "Find the Duplicate Number", difficulty: "Medium", link: "https://leetcode.com/problems/find-the-duplicate-number/", desc: "Find the duplicate number in an array of integers." },
    { id: 'tp3', title: "Happy Number", difficulty: "Medium", link: "https://leetcode.com/problems/happy-number/", desc: "Determine if a number is a happy number." },
    { id: 'tp4', title: "Reorder List", difficulty: "Medium", link: "https://leetcode.com/problems/reorder-list/", desc: "You are given the head of a singly linked-list. The list can be represented as:\n\nL0 → L1 → … → Ln - 1 → Ln\nReorder the list to be on the following form:\n\nL0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …\nYou may not modify the values in the list's nodes. Only nodes themselves may be changed." },
  ],
  5: [
    { id: 'tp1', title: "Reverse Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-linked-list/", desc: "Reverse a singly linked list." },
    { id: 'tp2', title: "Reverse Linked List II", difficulty: "Medium", link: "https://leetcode.com/problems/reverse-linked-list-ii/", desc: "Reverse a portion of a linked list." },
    { id: 'tp3', title: "Swap Nodes in Pairs", difficulty: "Medium", link: "https://leetcode.com/problems/swap-nodes-in-pairs/", desc: "Swap every two adjacent nodes in a linked list." },
    { id: 'tp4', title: "Rotate List", difficulty: "Medium", link: "https://leetcode.com/problems/rotate-list/", desc: "Rotate a linked list by k positions." },
  ],
  6: [
    { id: 'tp1', title: "Next Greater Element I", difficulty: "Medium", link: "https://leetcode.com/problems/next-greater-element-i/", desc: "Find the next greater element for each element in a list." },
    { id: 'tp2', title: "Daily Temperatures", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/", desc: "Return an array where each element represents the number of days until a warmer temperature." },
    { id: 'tp3', title: "Largest Rectangle in Histogram", difficulty: "Hard", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/", desc: "Find the largest rectangular area in a histogram." },
    { id: 'tp4', title: "Online Stock Span", difficulty: "Medium", link: "https://leetcode.com/problems/online-stock-span/", desc: "Calculate the span of stock prices for each day." },
  ],
  7: [
    { id: 'tp1', title: "Kth Largest Element in an Array", difficulty: "Medium", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/", desc: "Find the kth largest element in an array." },
    { id: 'tp2', title: "Top K Frequent Elements", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-elements/", desc: "Return the k most frequent elements in an array." },
    { id: 'tp3', title: "Find K Pairs with Smallest Sums", difficulty: "Medium", link: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/", desc: "Find the k pairs with the smallest sum from two sorted arrays." },
  ],
  8: [
    { id: 'tp1', title: "Merge Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/merge-intervals/", desc: "Merge overlapping intervals in a list." },
    { id: 'tp2', title: "Insert Interval", difficulty: "Medium", link: "https://leetcode.com/problems/insert-interval/", desc: "Insert a new interval into a list of non-overlapping intervals." },
    { id: 'tp3', title: "Non-Overlapping Intervals", difficulty: "Medium", link: "https://leetcode.com/problems/non-overlapping-intervals/", desc: "Return the minimum number of intervals to remove to make all intervals non-overlapping." },
  ],
  9:[
    { id: 'tp1', title: "Search in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/", desc: "Search for a target value in a rotated sorted array." },
    { id: 'tp2', title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", desc: "Find the minimum element in a rotated sorted array." },
    { id: 'tp3', title: "Search a 2D Matrix II", difficulty: "Medium", link: "https://leetcode.com/problems/search-a-2d-matrix-ii/", desc: "Search for a target value in a 2D matrix with sorted rows and columns." },
  ],
  10: [
    { id: 'tp1', title: "Binary Tree Inorder Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-inorder-traversal/", desc: "Perform an inorder traversal of a binary tree." },
    { id: 'tp2', title: "Binary Tree Zigzag Level Order Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/", desc: "Perform a zigzag level order traversal of a binary tree." },
    { id: 'tp3', title: "Binary Tree Paths", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-paths/", desc: "Return all root-to-leaf paths in a binary tree." },
  ],
  11: [
    { id: 'tp1', title: "Clone Graph", difficulty: "Medium", link: "https://leetcode.com/problems/clone-graph/", desc: "Clone a connected undirected graph." },
    { id: 'tp2', title: "Path Sum II", difficulty: "Medium", link: "https://leetcode.com/problems/path-sum-ii/", desc: "Find all root-to-leaf paths where the sum equals the target." },
    { id: 'tp3', title: "Course Schedule II", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule-ii/", desc: "Return the order of courses to finish all courses." },
  ],
  12: [
    { id: 'tp1', title: "Binary Tree Level Order Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/", desc: "Perform a level order traversal of a binary tree." },
    { id: 'tp2', title: "Rotting Oranges", difficulty: "Medium", link: "https://leetcode.com/problems/rotting-oranges/", desc: "Find the minimum time to rot all oranges in a grid." },
    { id: 'tp3', title: "Word Ladder", difficulty: "Hard", link: "https://leetcode.com/problems/word-ladder/", desc: "Find the shortest transformation sequence from beginWord to endWord." },
  ],
  13: [
    { id: 'tp1', title: "Set Matrix Zeroes", difficulty: "Medium", link: "https://leetcode.com/problems/set-matrix-zeroes/", desc: "Set all elements in a row and column to zero if an element is zero." },
    { id: 'tp2', title: "Number of Islands", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/", desc: "Count the number of islands in a 2D grid." },
    { id: 'tp3', title: "Spiral Matrix", difficulty: "Medium", link: "https://leetcode.com/problems/spiral-matrix/", desc: "Traverse a matrix in spiral order." },
  ],
  14: [
    { id: 'tp1', title: "Combination Sum", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum/", desc: "Find all combinations that sum up to a target value." },
    { id: 'tp2', title: "Sudoku Solver", difficulty: "Hard", link: "https://leetcode.com/problems/sudoku-solver/", desc: "Solve a Sudoku puzzle." },
    { id: 'tp3', title: "Permutations", difficulty: "Medium", link: "https://leetcode.com/problems/permutations/", desc: "Generate all permutations of a list of numbers." },
  ],
  15: [
    { id: 'tp1', title: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/", desc: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?" },
    { id: 'tp2', title: "Maximum Subarray", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-subarray/", desc: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum." },
    { id: 'tp3', title: "House Robber", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/", desc: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police." },
    { id: 'tp4', title: "Longest Palindromic Substring", difficulty: "Medium", link: "https://leetcode.com/problems/longest-palindromic-substring/", desc: "Given a string s, return the longest palindromic substring in s." },
    { id: 'tp5', title: "Unique Paths", difficulty: "Medium", link: "https://leetcode.com/problems/unique-paths/", desc: "A robot is located at the top-left corner of a m x n grid. The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner of the grid. How many possible unique paths are there?" },
    { id: 'tp6', title: "Coin Change", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change/", desc: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1." },
    { id: 'tp7', title: "Edit Distance", difficulty: "Hard", link: "https://leetcode.com/problems/edit-distance/", desc: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character." },
    { id: 'tp8', title: "Longest Increasing Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-increasing-subsequence/", desc: "Given an integer array nums, return the length of the longest strictly increasing subsequence." },
  ],
};

const DSAPatternTracker = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState(null);
  
  // State for Data
  const [progress, setProgress] = useState({});
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState(null);

  // Login Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const patterns = [
    { id: 1, name: "Prefix Sum", total: 3, color: "bg-blue-500", text: "text-blue-500" },
    { id: 2, name: "Two Pointers", total: 4, color: "bg-purple-500", text: "text-purple-500" },
    { id: 3, name: "Sliding Window", total: 4, color: "bg-pink-500", text: "text-pink-500" },
    { id: 4, name: "Fast & Slow Pointers", total: 4, color: "bg-indigo-500", text: "text-indigo-500" },
    { id: 5, name: "Linked List Reversal", total: 4, color: "bg-cyan-500", text: "text-cyan-500" },
    { id: 6, name: "Monotonic Stack", total: 4, color: "bg-teal-500", text: "text-teal-500" },
    { id: 7, name: "Top K Elements", total: 3, color: "bg-green-500", text: "text-green-500" },
    { id: 8, name: "Overlapping Intervals", total: 3, color: "bg-lime-500", text: "text-lime-500" },
    { id: 9, name: "Modified Binary Search", total: 3, color: "bg-yellow-500", text: "text-yellow-500" },
    { id: 10, name: "Binary Tree Traversal", total: 3, color: "bg-orange-500", text: "text-orange-500" },
    { id: 11, name: "Depth-First Search", total: 3, color: "bg-red-500", text: "text-red-500" },
    { id: 12, name: "Breadth-First Search", total: 3, color: "bg-rose-500", text: "text-rose-500" },
    { id: 13, name: "Matrix Traversal", total: 3, color: "bg-fuchsia-500", text: "text-fuchsia-500" },
    { id: 14, name: "Backtracking", total: 3, color: "bg-violet-500", text: "text-violet-500" },
    { id: 15, name: "Dynamic Programming", total: 7, color: "bg-blue-600", text: "text-blue-600" }
  ];

  // 1. Fetch User Data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProgress(data.progress || {});
          setStreak(data.streak || 0);
          setLastActiveDate(data.lastActiveDate || null);
        }
      } else {
        setProgress({});
        setStreak(0);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Save Progress to Firebase
  useEffect(() => {
    if (user && !loading) {
      const saveToCloud = async () => {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { 
          progress,
          streak,
          lastActiveDate
        }, { merge: true });
      };
      saveToCloud();
    }
  }, [progress, streak, lastActiveDate, user, loading]);

  // Login Handler
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      setShowLoginModal(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      setAuthError(err.message.replace("Firebase: ", ""));
    }
  };

  // 3. Logic: Toggle Problem & Update Streak
  const toggleProblem = (patternId, problemId) => {
    // A. Update Progress
    const currentPattern = progress[patternId] || { solved: [] };
    const isSolved = currentPattern.solved.includes(problemId);
    
    let newSolved;
    if (isSolved) {
      newSolved = currentPattern.solved.filter(id => id !== problemId);
    } else {
      newSolved = [...currentPattern.solved, problemId];
      // Only check streak if adding a problem (solving it)
      updateStreak();
    }

    setProgress(prev => ({
      ...prev,
      [patternId]: { ...currentPattern, solved: newSolved }
    }));
  };

  const updateStreak = () => {
    const today = new Date().toLocaleDateString();
    
    if (lastActiveDate !== today) {
      // Logic: If last active was yesterday, increment. Else if older, reset to 1.
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString();

      if (lastActiveDate === yesterdayStr) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(1); // Reset or Start new
      }
      setLastActiveDate(today);
    }
  };

  // 4. Calculate Stats
  const totalProblems = patterns.reduce((acc, p) => acc + p.total, 0);
  const totalPatterns = patterns.length;
  
  const solvedProblemsCount = Object.values(progress).reduce((acc, p) => acc + (p.solved?.length || 0), 0);
  const masteredPatternsCount = patterns.filter(p => {
    const solved = progress[p.id]?.solved?.length || 0;
    return solved === p.total;
  }).length;
  
  const overallPercentage = Math.round((solvedProblemsCount / totalProblems) * 100);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-400" />
            <span className="font-bold text-xl">DSA Master</span>
          </div>
          <div>
            {!user ? (
              <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-all">
                <LogIn size={18} /> Sign In
              </button>
            ) : (
              <div className="flex items-center gap-4">
                 <span className="text-sm font-medium hidden sm:block">{user.email}</span>
                 <button onClick={logout} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                   <LogOut size={18} />
                 </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={20} /></button>
            <h2 className="text-2xl font-bold text-white mb-2">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
            <form onSubmit={handleAuth} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white" required />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white" required />
              </div>
              {authError && <p className="text-red-400 text-sm">{authError}</p>}
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all">{isRegistering ? 'Sign Up' : 'Sign In'}</button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm text-purple-400 hover:text-purple-300">
                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!selectedPattern ? (
          <>
            <div className="mb-8 text-center">
               <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">Master Data Structures</h1>
               <p className="text-slate-400 max-w-2xl mx-auto">Track your progress through 15 essential coding patterns.</p>
            </div>

            {/* STATS DASHBOARD (RESTORED) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              {/* Card 1: Overall Progress */}
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-slate-400 text-sm">Overall</p>
                   <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white">{overallPercentage}%</p>
                <div className="mt-2 bg-slate-700 rounded-full h-1.5">
                   <div className="bg-green-400 h-1.5 rounded-full" style={{ width: `${overallPercentage}%` }} />
                </div>
              </div>

              {/* Card 2: Patterns Mastered */}
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                   <p className="text-slate-400 text-sm">Patterns Mastered</p>
                   <Target className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-white">{masteredPatternsCount}<span className="text-lg text-slate-500">/{totalPatterns}</span></p>
              </div>

              {/* Card 3: Problems Solved */}
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
                 <div className="flex items-center justify-between mb-2">
                   <p className="text-slate-400 text-sm">Problems Solved</p>
                   <Book className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">{solvedProblemsCount}<span className="text-lg text-slate-500">/{totalProblems}</span></p>
              </div>

              {/* Card 4: Streak */}
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
                 <div className="flex items-center justify-between mb-2">
                   <p className="text-slate-400 text-sm">Day Streak</p>
                   <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-3xl font-bold text-white">🔥 {streak}</p>
              </div>
            </div>

            {/* Pattern Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patterns.map((pattern) => {
                const pData = progress[pattern.id] || { solved: [] };
                const solvedCount = pData.solved.length;
                const isComplete = solvedCount === pattern.total;

                return (
                  <button 
                    key={pattern.id}
                    onClick={() => setSelectedPattern(pattern)}
                    className="group text-left bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-purple-500/30 rounded-2xl p-6 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${pattern.color} bg-opacity-20`}>
                        <Book className={`w-6 h-6 ${pattern.text}`} />
                      </div>
                      {isComplete && <CheckCircle className="text-green-500 w-6 h-6" />}
                    </div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400">{pattern.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{pattern.total} Problems</p>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className={`${pattern.color} h-full`} style={{ width: `${(solvedCount / pattern.total) * 100}%` }} />
                      </div>
                      <span className="text-slate-400 font-medium">{solvedCount}/{pattern.total}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="animate-fade-in">
            <button onClick={() => setSelectedPattern(null)} className="group flex items-center gap-2 text-slate-400 hover:text-white mb-6">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 mb-6">
              <h2 className="text-3xl font-bold text-white">{selectedPattern.name}</h2>
            </div>
            <div className="space-y-4">
              {PROBLEM_DATA[selectedPattern.id] ? (
                PROBLEM_DATA[selectedPattern.id].map((problem) => {
                  const isSolved = progress[selectedPattern.id]?.solved?.includes(problem.id);
                  return (
                    <div key={problem.id} className={`relative bg-slate-800/30 border ${isSolved ? 'border-green-500/30 bg-green-500/5' : 'border-white/5'} rounded-xl p-6 transition-all hover:border-white/20`}>
                      <div className="flex items-start gap-4">
                        <button onClick={() => toggleProblem(selectedPattern.id, problem.id)} className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSolved ? 'bg-green-500 border-green-500' : 'border-slate-500 hover:border-purple-400'}`}>
                          {isSolved && <CheckCircle size={16} className="text-white" />}
                        </button>
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${isSolved ? 'text-slate-300 line-through' : 'text-white'}`}>{problem.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded border ${problem.difficulty === 'Easy' ? 'border-green-500/30 text-green-400' : problem.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400' : 'border-red-500/30 text-red-400'}`}>{problem.difficulty}</span>
                          <p className="text-slate-400 text-sm mb-3 mt-2">{problem.desc}</p>
                          <a href={problem.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 font-medium">Solve <ExternalLink size={14} /></a>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-dashed border-white/10">
                  <p className="text-slate-400">Problem list coming soon!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DSAPatternTracker;