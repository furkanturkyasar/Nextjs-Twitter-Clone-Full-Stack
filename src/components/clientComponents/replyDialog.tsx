"user client"

import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { BsChat, BsDot, BsThreeDots } from 'react-icons/bs';
import React, { useState, useTransition } from 'react'
import dayjs from "dayjs";
import { Profile, Tweet } from "@/lib/db/schema";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { reply } from "@/lib/supabase/mutation";

type ReplyDialogProps = {
    tweet: {
        userProfile: Profile,
        tweetDetails: Tweet
      };
    repliesCount: number;
}

const ReplyDialog = ({tweet, repliesCount}: ReplyDialogProps) => {

    const [isReplyDialogOpen, setIsReplyDialogOpen] = useState<boolean>(false);

    let [isReplyPending, startTransition] = useTransition();
    const [supabase] = useState(() => createPagesBrowserClient());

    const [replyText, setReplyText] = useState<string>("");
    
  return (
    <Dialog onOpenChange={setIsReplyDialogOpen} open={isReplyDialogOpen} >
        <DialogTrigger asChild>
            <button  onClick={() => {
                
            }} className='rounded-full flex items-center space-x-2 hover:bg-white/10 transition duration-200 cursor-pointer p-3'>
                <BsChat/>
                <span>{repliesCount || 0}</span>
            </button>
        </DialogTrigger>
        <DialogContent className="bg-black sm:max-w-2xl border-none text-white">
            <div key={tweet.tweetDetails.id} className='border-b-[0.5px] border-gray-600 p-2 flex space-x-4 w-full'>
                    <div>
                        <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
                    </div>
                      <div className='flex flex-col w-full'>
                        <div className='flex items-center w-full justify-between'>
                          <div className='flex items-center space-x-1 w-full'>
                            <div className='font-bold'>{tweet.userProfile.fullName ?? ""}</div>
                            <div className='text-gray-500'>@{tweet.userProfile.username}</div>
                            <div className='text-gray-500'><BsDot/></div>
                            <div className='text-gray-500'>{dayjs(tweet.tweetDetails.createdAt).fromNow()}</div>
                          </div>
                          <div><BsThreeDots/></div>
                        </div>
                        <div className='text-white text-base w-full my-4'>
                          {tweet.tweetDetails.text}
                        </div>
                       
                      </div>
            </div>
            <div>
                Replying to @{tweet.userProfile.username}
            </div>
            <div className="flex w-full items-center space-x-4">
                    <div>
                        <div className='w-10 h-10 bg-slate-200 rounded-full'></div>
                    </div>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} className='w-full h-full text-xl placeholder:text-gray-600 bg-transparent border-none outline-none p-4 border-gray-600' />
                
            </div>
            <div className='w-full justify-between items-center flex'>
                  <div></div>
                  <div className='w-full h-full max-w-[100px]'>
                    <button disabled={isReplyPending}  onClick={() => {
                        supabase.auth.getUser().then((res) => {
                            if (res.data && res.data.user) {
                              const user = res.data.user
                              startTransition(() => {
                                reply({
                                    replyText,
                                    userId: user.id,
                                    tweetId: tweet.tweetDetails.id
                                }).then(() => {
                                    setIsReplyDialogOpen(false)
                                }).catch(() => {
                                    toast.error('something went wrong')
                                })
                              })
                            } else {
                              toast("please login to reply a tweet");
                            }
                          }).catch(() => {
                            toast.error('Authentication failed!')
                          })
                    }}  className="rounded-full font-bold bg-twitterColor px-4 py-2 w-full text-lg text-center hover:opacity-70 transition duration-200">
                      Reply
                    </button>
                  </div>
                </div>
        </DialogContent>                  
    </Dialog>
  )
}

export default ReplyDialog