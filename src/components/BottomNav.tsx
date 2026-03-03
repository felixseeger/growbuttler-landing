import React from 'react';
import Link from 'next/link';
import styles from './BottomNav.module.css';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <path d="M12 11v3M10 12.5l1.5 1.5M14 12.5l-1.5 1.5" stroke="#4CAF50" strokeWidth="1.5"/>
  </svg>
);

const JournalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <path d="M10 7l2 2 2-2" stroke="#4CAF50" strokeWidth="1.5"/>
  </svg>
);

const AddIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
    <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const ExpertsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M18 4l1 1-1 1" stroke="#4CAF50" strokeWidth="1.5"/>
  </svg>
);

const FeedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    <path d="M10 8l2 2 2-2" stroke="#4CAF50" strokeWidth="1.5"/>
  </svg>
);

export function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      <Link href="/dashboard" className={styles.navItem}>
        <HomeIcon />
        <span>Home</span>
      </Link>
      
      <Link href="/journal" className={styles.navItem}>
        <JournalIcon />
        <span>Journal</span>
      </Link>
      
      <Link href="/journal/new-entry" className={styles.navItemCenter}>
        <AddIcon />
      </Link>
      
      <Link href="/experts" className={styles.navItem}>
        <ExpertsIcon />
        <span>Experts</span>
      </Link>
      
      <Link href="/community" className={styles.navItem}>
        <FeedIcon />
        <span>Feed</span>
      </Link>
    </nav>
  );
}
