import React from "react";
import { UserDropDown } from "../components/nav-header";

function SubscribePage() {
  return (
    <main className="min-h-screen py-12">
      <div className="max-w-md mx-auto">
        <UserDropDown />
        <div className="flex flex-col items-center justify-between px-6 py-5 space-y-10 border border-gray-700 rounded">
          <p className="text-sm leading-snug text-center text-gray-400">
            You have no active subscription, <br /> please purchase your
            membership <br />
            to start using this extension
          </p>

          <a
            href="https://smssender.chatwa.id/purchase"
            target="_blank"
            className="flex items-center justify-center w-64 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded shadow-md"
          >
            Subscribe
          </a>
        </div>
      </div>
    </main>
  );
}

export default SubscribePage;
