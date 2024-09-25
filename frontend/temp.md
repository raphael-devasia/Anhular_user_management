<div style="background-color : #f4f4f0" class="sm:mx-32 lg:mx-32 xl:mx-72 profileStyle">
    <div class="flex justify-between container mx-auto">
        <div class="w-full">
            <div class="mt-4 px-4">
                <form (ngSubmit)="onSubmit()" class="mx-5 my-5" enctype="multipart/form-data">
                    <!-- First Name -->
                    <label class="relative block p-3 border-2 border-black rounded">
                        <span class="text-md font-semibold text-zinc-900">First Name</span>
                        <input class="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                            [(ngModel)]="firstName" name="firstName" type="text" placeholder="{{firstName}}"
                            required />
                    </label>

                    <!-- Last Name -->
                    <label class="relative block p-3 border-2 border-black rounded mt-4">
                        <span class="text-md font-semibold text-zinc-900">Last Name</span>
                        <input class="w-full bg-transparent p-0 text-sm text-gray-500 focus:outline-none"
                            [(ngModel)]="lastName" name="lastName" type="text" placeholder="Your Last Name" required />
                    </label>

                    <!-- Email -->
                    <label class="relative block p-3 border-2 mt-5 border-black rounded">
                        <span class="text-md font-semibold text-zinc-900">Email</span>
                        <input class="w-full p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none"
                            [(ngModel)]="email" name="email" type="email" placeholder="Your Email" disabled />
                    </label>

                    <!-- Phone Number -->
                    <label class="relative block p-3 border-2 mt-5 border-black rounded">
                        <span class="text-md font-semibold text-zinc-900">Phone Number</span>
                        <input class="w-full p-0 text-sm border-none bg-transparent text-gray-500 focus:outline-none"
                            [(ngModel)]="phoneNumber" name="phoneNumber" type="tel" placeholder="Your Phone Number"
                            disabled="" />
                    </label>

                    <!-- Profile Image Preview -->
                <div class="shrink-0 mt-5">
                    <!-- Display profile image from the server only if no new image is selected -->
                    <img *ngIf="!profileImageUrl && profileImage" class="h-20 w-20 object-cover rounded-full"
                        [src]="'http://localhost:5050/' + profileImage" alt="Profile Image Preview" />
                </div>
                <div class="shrink-0 mt-5">
                    <!-- Display profile image from local file input -->
                    <img *ngIf="profileImageUrl" class="h-20 w-20 object-cover rounded-full" [src]="profileImageUrl"
                        alt="Profile Image Preview" />
                </div>



                    <!-- Profile Image Input -->
                    <label class="block pt-2">
                        <span class="sr-only">Choose profile photo</span>
                        <input type="file" name="profileImage" (change)="selectImage($event)"
                            class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-300 file:text-zinc-900 hover:file:bg-rose-300" />
                    </label>

                    <!-- Submit Button -->
                    <button type="submit"
                        class="mt-5 border-2 px-5 py-2 rounded-lg border-black border-b-4 font-black translate-y-2 border-l-4">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>