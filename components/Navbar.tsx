"use client";
import { cn } from '@/lib/utils';
import { usePathname } from 'next/dist/client/components/navigation';
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react';
import { SignInButton, SignUpButton, Show, UserButton, useUser } from "@clerk/nextjs";




const Navbar = () => {
    const navItems = [
        { label: 'Library', href: '/', },
        { label: 'Add New', href: '/books/new' }
    ];

    const pathname = usePathname();
    const { user } = useUser();

    return (
        <header className='w-full fixed z-50 bg-(--bg-primary)'>
            <div className='wrapper navbar-height py-4 flex justify-between items-center'>
                <Link href='/' className='flex gap-0.5 items-center'>
                    <Image src='/assets/logo.png' alt='Bookified Logo' width='42' height='26' className='object-contain' />
                    <span className="logo-text">Bookified</span>
                </Link>

                <nav className="w-fit flex gap-7.5 items-center">
                    {navItems.map(({ label, href }) => {
                        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                        return (
                            <Link href={href} key={href} className={cn('nav-link-base', isActive ? 'nav-link-active' : 'text-black hover:opacity-70')}>
                                {label}
                            </Link>
                        )
                    })}

                    <div className="flex gap7.5 items-center">
                        <Show when="signed-out">
                            <SignInButton />
                            <SignUpButton />
                        </Show>
                        <Show when="signed-in">
                            <div className="nav-user-link">
                                <UserButton />
                                {user?.firstName && (
                                    <Link href="/subscribtion" className='nav-user-name'>{user.firstName}</Link>
                                )}
                            </div>
                        </Show>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar